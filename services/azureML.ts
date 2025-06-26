// Azure ML Studio 연동 서비스

interface ClusteringRequest {
  memberVotes: Array<{
    memberId: string
    votes: number[] // 원-핫 인코딩된 표결 데이터
  }>
}

interface ClusteringResponse {
  results: Array<{
    memberId: string
    cluster: number
    coordinates: [number, number]
    similarity: number
  }>
}

export class AzureMLService {
  private endpoint: string
  private apiKey: string

  constructor() {
    this.endpoint = process.env.AZURE_ML_ENDPOINT!
    this.apiKey = process.env.AZURE_ML_API_KEY!
  }

  async performClustering(memberVotes: ClusteringRequest["memberVotes"]): Promise<ClusteringResponse> {
    try {
      const response = await fetch(`${this.endpoint}/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          data: memberVotes,
        }),
      })

      if (!response.ok) {
        throw new Error(`Azure ML API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Azure ML clustering error:", error)
      throw error
    }
  }

  async findSimilarMembers(userVotes: number[], topK = 5): Promise<string[]> {
    try {
      const response = await fetch(`${this.endpoint}/similarity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userVotes,
          topK,
        }),
      })

      const result = await response.json()
      return result.similarMembers
    } catch (error) {
      console.error("Similar members finding error:", error)
      throw error
    }
  }
}
