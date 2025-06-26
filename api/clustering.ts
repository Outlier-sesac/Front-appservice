// 군집화 API 엔드포인트

import type { NextApiRequest, NextApiResponse } from "next"
import { AzureMLService } from "../services/azureML"
import { getDbConnection } from "../config/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { memberIds } = req.body
    const pool = await getDbConnection()

    // 의원들의 표결 데이터 가져오기
    const result = await pool
      .request()
      .input("memberIds", memberIds.join(","))
      .query(`
        SELECT m.Id as MemberId, v.BillId, v.Position
        FROM Members m
        LEFT JOIN Votes v ON m.Id = v.MemberId
        WHERE m.Id IN (SELECT value FROM STRING_SPLIT(@memberIds, ','))
      `)

    // 표결 데이터를 원-핫 인코딩으로 변환
    const memberVotes = transformToOneHot(result.recordset)

    // Azure ML Studio에서 군집화 수행
    const azureML = new AzureMLService()
    const clusteringResult = await azureML.performClustering(memberVotes)

    // 결과를 데이터베이스에 저장
    for (const result of clusteringResult.results) {
      await pool
        .request()
        .input("id", generateId())
        .input("memberId", result.memberId)
        .input("clusterNumber", result.cluster)
        .input("coordinateX", result.coordinates[0])
        .input("coordinateY", result.coordinates[1])
        .input("similarity", result.similarity)
        .input("modelVersion", "v1.0")
        .query(`
          INSERT INTO ClusteringResults (Id, MemberId, ClusterNumber, CoordinateX, CoordinateY, Similarity, ModelVersion)
          VALUES (@id, @memberId, @clusterNumber, @coordinateX, @coordinateY, @similarity, @modelVersion)
        `)
    }

    res.status(200).json({ success: true, results: clusteringResult.results })
  } catch (error) {
    console.error("Clustering API error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

function transformToOneHot(voteData: any[]): any[] {
  // 표결 데이터를 원-핫 인코딩으로 변환하는 로직
  // 실제 구현에서는 더 복잡한 변환 로직 필요
  return []
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
