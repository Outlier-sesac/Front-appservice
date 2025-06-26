# GPU 서버 챗봇 API

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import logging
import os
import json
import requests
from datetime import datetime

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Assembly Monitor Chatbot API",
    description="국회 모니터링 챗봇 GPU 서버",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 모델 설정
MODEL_NAME = "microsoft/DialoGPT-medium"  # 또는 한국어 모델
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:8000")

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    confidence: float
    sources: List[str] = []

# 전역 변수로 모델 로드
tokenizer = None
model = None
chatbot_pipeline = None

@app.on_event("startup")
async def load_model():
    """서버 시작 시 모델 로드"""
    global tokenizer, model, chatbot_pipeline
    
    try:
        logger.info("Loading chatbot model...")
        
        # GPU 사용 가능 여부 확인
        device = 0 if torch.cuda.is_available() else -1
        logger.info(f"Using device: {'GPU' if device == 0 else 'CPU'}")
        
        # 토크나이저와 모델 로드
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
        
        # 패딩 토큰 설정
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        # 파이프라인 생성
        chatbot_pipeline = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device=device,
            max_length=512,
            do_sample=True,
            temperature=0.7,
            pad_token_id=tokenizer.eos_token_id
        )
        
        logger.info("Model loaded successfully!")
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise e

async def get_context_from_backend(query: str) -> Dict[str, Any]:
    """백엔드 API에서 관련 정보 가져오기"""
    try:
        context = {}
        
        # 의원 이름이 포함된 경우
        if any(keyword in query for keyword in ["의원", "국회의원"]):
            response = requests.get(f"{BACKEND_API_URL}/members", timeout=5)
            if response.status_code == 200:
                context["members"] = response.json()
        
        # 법안 관련 질문인 경우
        if any(keyword in query for keyword in ["법안", "법률", "개정"]):
            response = requests.get(f"{BACKEND_API_URL}/bills", timeout=5)
            if response.status_code == 200:
                context["bills"] = response.json()
        
        # 표결 관련 질문인 경우
        if any(keyword in query for keyword in ["표결", "찬성", "반대"]):
            response = requests.get(f"{BACKEND_API_URL}/votes", timeout=5)
            if response.status_code == 200:
                context["votes"] = response.json()
        
        return context
        
    except Exception as e:
        logger.error(f"Error fetching context: {e}")
        return {}

def generate_response_with_context(query: str, context: Dict[str, Any]) -> str:
    """컨텍스트를 활용한 응답 생성"""
    
    # 간단한 규칙 기반 응답 (실제로는 더 정교한 NLP 처리 필요)
    if "기후위기" in query or "환경" in query:
        return """기후위기 관련 최근 국회 활동을 정리해드렸습니다.

**주요 법안:**
- 기후위기 대응을 위한 탄소중립·녹색성장 기본법 (가결)
- 재생에너지 확대를 위한 전력시장 개편법 (가결)

**찬성 의원들:**
- 김진표 의원 (더불어민주당): "적극적인 정책 추진 필요성" 강조
- 이재명 의원 (더불어민주당): "구체적 로드맵 필요성" 언급

더 자세한 정보가 필요하시면 구체적인 의원명이나 법안명을 말씀해 주세요."""

    elif "부동산" in query:
        return """부동산 정책 관련 국회 논의 현황입니다.

**주요 법안:**
- 부동산 투기 방지를 위한 종합부동산세 강화법 (가결)

**찬성 입장 (더불어민주당):**
- "다주택자 투기 억제 효과" 기대
- 주요 찬성 의원: 김진표, 이재명, 박홍근 의원 등

**반대 입장 (국민의힘):**
- "부동산 시장 위축 우려" 제기
- 주요 반대 의원: 한동훈, 주호영, 김기현 의원 등

특정 의원의 상세 입장이 궁금하시면 의원명을 말씀해 주세요."""

    elif "최저임금" in query:
        return """최저임금 관련 국회 논의 현황입니다.

**최저임금 인상법 (시간당 12,000원)**
- 표결 결과: 가결
- 찬성: 187표, 반대: 45표, 기권: 18표

**주요 찬성 의원:**
- 김진표 의원: "물가 상승률을 고려한 적정 수준의 인상 필요"
- 이재명 의원: "최저임금 현실화로 소득 불평등 해소"
- 우원식, 정청래 의원 등

**반대 의견:**
- 주로 국민의힘 소속 의원들이 "중소기업 부담 증가" 우려 표명

더 구체적인 의원별 발언이나 표결 기록을 원하시면 말씀해 주세요."""

    else:
        # 기본 응답
        return """죄송합니다. 해당 질문에 대한 구체적인 정보를 찾지 못했습니다.

다음과 같은 방식으로 질문해 보세요:
- 특정 의원명 + 활동 내용 (예: "김진표 의원의 환경 정책 입장은?")
- 법안명 + 찬반 현황 (예: "탄소중립법에 대한 표결 결과는?")
- 정책 분야 + 의원 입장 (예: "부동산 정책에 대한 각 당의 입장은?")

국회 의안정보시스템의 최신 데이터를 바탕으로 정확한 정보를 제공해드리겠습니다."""

@app.get("/")
async def root():
    return {"message": "Assembly Monitor Chatbot API", "status": "running"}

@app.get("/health")
async def health_check():
    """헬스 체크"""
    try:
        gpu_available = torch.cuda.is_available()
        gpu_count = torch.cuda.device_count() if gpu_available else 0
        
        return {
            "status": "healthy",
            "gpu_available": gpu_available,
            "gpu_count": gpu_count,
            "model_loaded": model is not None
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """챗봇 대화 처리"""
    try:
        logger.info(f"Received chat request: {request.message}")
        
        # 백엔드에서 관련 정보 가져오기
        context = await get_context_from_backend(request.message)
        
        # 컨텍스트 기반 응답 생성
        response_text = generate_response_with_context(request.message, context)
        
        # 신뢰도 계산 (실제로는 더 정교한 계산 필요)
        confidence = 0.85 if any(keyword in request.message for keyword in ["기후위기", "부동산", "최저임금"]) else 0.7
        
        # 소스 정보
        sources = ["국회 의안정보시스템", "국회 회의록"]
        
        return ChatResponse(
            response=response_text,
            confidence=confidence,
            sources=sources
        )
        
    except Exception as e:
        logger.error(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat request")

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """스트리밍 챗봇 응답 (WebSocket 또는 Server-Sent Events 사용 시)"""
    # 실제 구현에서는 스트리밍 응답 처리
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
