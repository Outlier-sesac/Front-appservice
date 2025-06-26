#!/bin/bash

# Azure 배포 스크립트

set -e

echo "=== Assembly Monitor 배포 스크립트 ==="

# 환경 변수 확인
if [ -z "$AZURE_SUBSCRIPTION_ID" ]; then
    echo "Error: AZURE_SUBSCRIPTION_ID 환경 변수가 설정되지 않았습니다."
    exit 1
fi

if [ -z "$RESOURCE_GROUP" ]; then
    echo "Error: RESOURCE_GROUP 환경 변수가 설정되지 않았습니다."
    exit 1
fi

# Azure CLI 로그인 확인
echo "Azure CLI 로그인 상태 확인..."
az account show > /dev/null 2>&1 || {
    echo "Azure CLI에 로그인해주세요."
    az login
}

# 구독 설정
az account set --subscription $AZURE_SUBSCRIPTION_ID

echo "=== 1. 프론트엔드 (Azure App Service) 배포 ==="

# Next.js 빌드
echo "Next.js 애플리케이션 빌드 중..."
npm run build

# App Service에 배포
echo "Azure App Service에 배포 중..."
az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $FRONTEND_APP_NAME \
    --src ./build.zip

echo "=== 2. 백엔드 VM 설정 ==="

# VM 생성 (이미 존재하지 않는 경우)
echo "백엔드 VM 상태 확인..."
if ! az vm show --resource-group $RESOURCE_GROUP --name $BACKEND_VM_NAME > /dev/null 2>&1; then
    echo "백엔드 VM 생성 중..."
    az vm create \
        --resource-group $RESOURCE_GROUP \
        --name $BACKEND_VM_NAME \
        --image Ubuntu2004 \
        --admin-username azureuser \
        --generate-ssh-keys \
        --size Standard_B2s \
        --public-ip-sku Standard
fi

# VM에 Docker 설치 및 애플리케이션 배포
echo "백엔드 애플리케이션 배포 중..."
VM_IP=$(az vm show -d --resource-group $RESOURCE_GROUP --name $BACKEND_VM_NAME --query publicIps -o tsv)

# SSH를 통해 VM에 배포 스크립트 실행
ssh -o StrictHostKeyChecking=no azureuser@$VM_IP << 'EOF'
# Docker 설치
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 애플리케이션 코드 다운로드 (Git 또는 파일 전송)
git clone https://github.com/your-repo/assembly-monitor.git
cd assembly-monitor

# 환경 변수 설정
cat > .env << EOL
DB_SERVER=${DB_SERVER}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
EOL

# Docker Compose로 백엔드 실행
docker-compose up -d backend
EOF

echo "=== 3. GPU 서버 설정 ==="

# GPU VM 생성 (이미 존재하지 않는 경우)
echo "GPU 서버 상태 확인..."
if ! az vm show --resource-group $RESOURCE_GROUP --name $GPU_VM_NAME > /dev/null 2>&1; then
    echo "GPU VM 생성 중..."
    az vm create \
        --resource-group $RESOURCE_GROUP \
        --name $GPU_VM_NAME \
        --image "microsoft-dsvm:ubuntu-1804:1804:latest" \
        --admin-username azureuser \
        --generate-ssh-keys \
        --size Standard_NC6s_v3 \
        --public-ip-sku Standard
fi

# GPU VM에 챗봇 애플리케이션 배포
echo "챗봇 애플리케이션 배포 중..."
GPU_VM_IP=$(az vm show -d --resource-group $RESOURCE_GROUP --name $GPU_VM_NAME --query publicIps -o tsv)

ssh -o StrictHostKeyChecking=no azureuser@$GPU_VM_IP << 'EOF'
# NVIDIA Docker 설치
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update && sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker

# 애플리케이션 코드 다운로드
git clone https://github.com/your-repo/assembly-monitor.git
cd assembly-monitor

# 환경 변수 설정
cat > .env << EOL
BACKEND_API_URL=http://${BACKEND_VM_IP}:8000
EOL

# Docker Compose로 챗봇 실행
docker-compose up -d chatbot
EOF

echo "=== 4. 네트워크 보안 그룹 설정 ==="

# 백엔드 VM 포트 8000 열기
az network nsg rule create \
    --resource-group $RESOURCE_GROUP \
    --nsg-name ${BACKEND_VM_NAME}NSG \
    --name AllowBackendAPI \
    --protocol tcp \
    --priority 1000 \
    --destination-port-range 8000 \
    --access allow

# GPU VM 포트 8001 열기
az network nsg rule create \
    --resource-group $RESOURCE_GROUP \
    --nsg-name ${GPU_VM_NAME}NSG \
    --name AllowChatbotAPI \
    --protocol tcp \
    --priority 1000 \
    --destination-port-range 8001 \
    --access allow

echo "=== 5. App Service 환경 변수 설정 ==="

# 프론트엔드 App Service에 환경 변수 설정
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $FRONTEND_APP_NAME \
    --settings \
    NEXT_PUBLIC_API_BASE_URL=http://$VM_IP:8000 \
    NEXT_PUBLIC_CHATBOT_API_URL=http://$GPU_VM_IP:8001

echo "=== 배포 완료 ==="
echo "프론트엔드: https://${FRONTEND_APP_NAME}.azurewebsites.net"
echo "백엔드 API: http://${VM_IP}:8000"
echo "챗봇 API: http://${GPU_VM_IP}:8001"
echo ""
echo "배포가 완료되었습니다!"
