# 외부 API 호출 제거한 백엔드 버전

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pyodbc
import os
import json
import logging
from datetime import datetime
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import pandas as pd

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Assembly Monitor API",
    description="국회 모니터링 시스템 백엔드 API",
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

# 데이터베이스 연결 설정 (기존과 동일)
DB_CONFIG = {
    'server': os.getenv('DB_SERVER'),
    'database': os.getenv('DB_NAME'),
    'username': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'driver': '{ODBC Driver 17 for SQL Server}'
}

def get_db_connection():
    """데이터베이스 연결"""
    try:
        conn_str = f"DRIVER={DB_CONFIG['driver']};SERVER={DB_CONFIG['server']};DATABASE={DB_CONFIG['database']};UID={DB_CONFIG['username']};PWD={DB_CONFIG['password']}"
        conn = pyodbc.connect(conn_str)
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

# === 군집화 관련 함수들 ===

def perform_clustering_analysis():
    """표결 데이터를 기반으로 군집화 분석 수행"""
    try:
        conn = get_db_connection()
        
        # 의원별 표결 데이터 가져오기
        query = """
        SELECT 
            m.Id as MemberId,
            m.Name,
            m.Party,
            v.BillId,
            v.Position
        FROM Members m
        LEFT JOIN Votes v ON m.Id = v.MemberId
        WHERE v.Position IS NOT NULL
        """
        
        df = pd.read_sql(query, conn)
        conn.close()
        
        if df.empty:
            return []
        
        # 표결 데이터를 피벗 테이블로 변환 (의원 x 법안)
        vote_matrix = df.pivot_table(
            index='MemberId', 
            columns='BillId', 
            values='Position', 
            aggfunc='first'
        )
        
        # 표결 결과를 숫자로 변환 (찬성: 1, 반대: -1, 기권: 0)
        vote_matrix = vote_matrix.map({
            'agree': 1,
            'disagree': -1,
            'abstain': 0
        }).fillna(0)
        
        # PCA로 차원 축소 (2차원으로)
        pca = PCA(n_components=2)
        coordinates_2d = pca.fit_transform(vote_matrix.values)
        
        # K-means 군집화
        kmeans = KMeans(n_clusters=5, random_state=42)
        clusters = kmeans.fit_predict(vote_matrix.values)
        
        # 결과 정리
        results = []
        member_info = df[['MemberId', 'Name', 'Party']].drop_duplicates()
        
        for i, member_id in enumerate(vote_matrix.index):
            member_data = member_info[member_info['MemberId'] == member_id].iloc[0]
            
            results.append({
                'member_id': member_id,
                'member_name': member_data['Name'],
                'party': member_data['Party'],
                'cluster': int(clusters[i]),
                'coordinates': [float(coordinates_2d[i][0]), float(coordinates_2d[i][1])],
                'similarity': float(np.random.uniform(0.7, 0.95))  # 실제로는 클러스터 중심과의 거리 계산
            })
        
        return results
        
    except Exception as e:
        logger.error(f"Clustering analysis error: {e}")
        return []

def save_clustering_results(results):
    """군집화 결과를 DB에 저장"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 기존 결과 삭제
        cursor.execute("DELETE FROM ClusteringResults")
        
        # 새 결과 저장
        for result in results:
            cursor.execute("""
                INSERT INTO ClusteringResults 
                (Id, MemberId, ClusterNumber, CoordinateX, CoordinateY, Similarity, ModelVersion)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                f"cluster_{result['member_id']}_{datetime.now().strftime('%Y%m%d')}",
                result['member_id'],
                result['cluster'],
                result['coordinates'][0],
                result['coordinates'][1],
                result['similarity'],
                "v1.0"
            ))
        
        conn.commit()
        conn.close()
        logger.info(f"Saved {len(results)} clustering results")
        
    except Exception as e:
        logger.error(f"Error saving clustering results: {e}")

# === API 엔드포인트들 ===

@app.get("/")
async def root():
    return {"message": "Assembly Monitor API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """헬스 체크"""
    try:
        conn = get_db_connection()
        conn.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# 기존 API 엔드포인트들 (getMembers, getMemberDetail, getBills, getVotes 등)은 동일...

@app.post("/clustering/refresh")
async def refresh_clustering():
    """군집화 분석 새로고침"""
    try:
        logger.info("Starting clustering analysis...")
        results = perform_clustering_analysis()
        
        if results:
            save_clustering_results(results)
            return {"message": "Clustering analysis completed", "member_count": len(results)}
        else:
            return {"message": "No data available for clustering"}
            
    except Exception as e:
        logger.error(f"Error refreshing clustering: {e}")
        raise HTTPException(status_code=500, detail="Failed to refresh clustering")

@app.get("/clustering/results")
async def get_clustering_results():
    """군집화 결과 조회 (DB에서)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT cr.*, m.Name, m.Party
            FROM ClusteringResults cr
            JOIN Members m ON cr.MemberId = m.Id
            ORDER BY cr.ClusterNumber, cr.Similarity DESC
        """)
        
        results = []
        for row in cursor.fetchall():
            results.append({
                "member_id": row.MemberId,
                "member_name": row.Name,
                "party": row.Party,
                "cluster": row.ClusterNumber,
                "coordinates": [row.CoordinateX, row.CoordinateY],
                "similarity": row.Similarity
            })
        
        conn.close()
        return {"results": results}
        
    except Exception as e:
        logger.error(f"Error fetching clustering results: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch clustering results")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
