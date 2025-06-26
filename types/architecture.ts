// 시스템 아키텍처 타입 정의

export interface Member {
  id: string
  name: string
  party: string
  region: string
  committee: string[]
  term: number
  profileImage?: string
}

export interface Bill {
  id: string
  title: string
  description: string
  category: string
  proposedDate: Date
  status: "pending" | "passed" | "rejected"
  votes: Vote[]
}

export interface Vote {
  memberId: string
  billId: string
  position: "agree" | "disagree" | "abstain"
  votedAt: Date
}

export interface ClusteringResult {
  memberId: string
  cluster: number
  coordinates: {
    x: number
    y: number
  }
  similarity: number
}

export interface UserProfile {
  id: string
  preferences: Record<string, any>
  votingHistory: UserVote[]
  interestedIssues: string[]
}

export interface UserVote {
  billId: string
  position: "agree" | "disagree" | "abstain"
  confidence: number
}

export interface ChatMessage {
  id: string
  userId: string
  message: string
  response: string
  timestamp: Date
  context?: any
}
