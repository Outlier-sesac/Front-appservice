// 불필요한 API 호출 제거한 버전

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:8001"

export class ApiClient {
  private baseUrl: string
  private chatbotUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
    this.chatbotUrl = CHATBOT_API_URL
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async chatbot(message: string, context?: any) {
    const response = await fetch(`${this.chatbotUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context,
      }),
    })

    if (!response.ok) {
      throw new Error(`Chatbot API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // === 실제 사용할 API 메서드들 ===

  // 의원 정보 조회 (DB에서)
  async getMembers(region?: string) {
    const endpoint = region ? `/members?region=${encodeURIComponent(region)}` : "/members"
    return this.get(endpoint)
  }

  // 의원 상세 정보 (DB에서)
  async getMemberDetail(memberId: string) {
    return this.get(`/members/${memberId}`)
  }

  // 표결 기록 조회 (DB에서)
  async getVotes(memberId?: string, billId?: string) {
    const params = new URLSearchParams()
    if (memberId) params.append("member_id", memberId)
    if (billId) params.append("bill_id", billId)

    const endpoint = `/votes${params.toString() ? "?" + params.toString() : ""}`
    return this.get(endpoint)
  }

  // 법안 조회 (DB에서)
  async getBills(category?: string, keyword?: string) {
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (keyword) params.append("keyword", keyword)

    const endpoint = `/bills${params.toString() ? "?" + params.toString() : ""}`
    return this.get(endpoint)
  }

  // 성향 분석 (백엔드 파이썬에서 처리)
  async analyzePersonality(votes: Record<string, string>) {
    return this.post("/personality/analyze", { votes })
  }

  // 유사 의원 찾기 (백엔드 파이썬에서 처리)
  async findSimilarMembers(votes: Record<string, string>) {
    return this.post("/members/similar", { votes })
  }

  // 통계 데이터 조회 (DB에서)
  async getStatistics() {
    return this.get("/statistics")
  }

  // 군집화 결과 조회 (백엔드 파이썬에서 미리 계산된 결과를 DB에서)
  async getClusteringResults() {
    return this.get("/clustering/results")
  }

  // 이슈별 분석 (DB에서)
  async getIssueAnalysis(keyword: string) {
    return this.get(`/issues/analysis?keyword=${encodeURIComponent(keyword)}`)
  }
}

export const apiClient = new ApiClient()
