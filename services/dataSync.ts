// 외부 데이터 동기화 서비스

import { getDbConnection } from "../config/database"

export class DataSyncService {
  private assemblyApiUrl: string
  private openDataApiKey: string

  constructor() {
    this.assemblyApiUrl = process.env.ASSEMBLY_API_URL!
    this.openDataApiKey = process.env.OPEN_DATA_API_KEY!
  }

  async syncMemberData(): Promise<void> {
    try {
      // 국회 의안정보시스템에서 의원 정보 가져오기
      const response = await fetch(`${this.assemblyApiUrl}/members`, {
        headers: {
          Authorization: `Bearer ${this.openDataApiKey}`,
        },
      })

      const members = await response.json()
      const pool = await getDbConnection()

      for (const member of members.data) {
        await pool
          .request()
          .input("id", member.id)
          .input("name", member.name)
          .input("party", member.party)
          .input("region", member.region)
          .input("term", member.term)
          .input("committee", JSON.stringify(member.committee))
          .query(`
            MERGE Members AS target
            USING (SELECT @id as Id, @name as Name, @party as Party, @region as Region, @term as Term, @committee as Committee) AS source
            ON target.Id = source.Id
            WHEN MATCHED THEN
              UPDATE SET Name = source.Name, Party = source.Party, Region = source.Region, Term = source.Term, Committee = source.Committee, UpdatedAt = GETDATE()
            WHEN NOT MATCHED THEN
              INSERT (Id, Name, Party, Region, Term, Committee) VALUES (source.Id, source.Name, source.Party, source.Region, source.Term, source.Committee);
          `)
      }

      console.log("Member data sync completed")
    } catch (error) {
      console.error("Member data sync error:", error)
      throw error
    }
  }

  async syncVoteData(): Promise<void> {
    try {
      // 표결 데이터 동기화 로직
      const response = await fetch(`${this.assemblyApiUrl}/votes`, {
        headers: {
          Authorization: `Bearer ${this.openDataApiKey}`,
        },
      })

      const votes = await response.json()
      const pool = await getDbConnection()

      for (const vote of votes.data) {
        await pool
          .request()
          .input("id", vote.id)
          .input("memberId", vote.memberId)
          .input("billId", vote.billId)
          .input("position", vote.position)
          .input("votedAt", new Date(vote.votedAt))
          .query(`
            INSERT INTO Votes (Id, MemberId, BillId, Position, VotedAt)
            VALUES (@id, @memberId, @billId, @position, @votedAt)
          `)
      }

      console.log("Vote data sync completed")
    } catch (error) {
      console.error("Vote data sync error:", error)
      throw error
    }
  }

  async syncTranscriptData(): Promise<void> {
    // 회의록 데이터 동기화 로직
    // 실제 구현에서는 회의록 파싱 및 AI 요약 포함
  }
}
