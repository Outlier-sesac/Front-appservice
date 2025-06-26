// Azure OpenAI 서비스

import { OpenAI } from "openai"

export class ChatbotService {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      baseURL: `https://${process.env.AZURE_OPENAI_RESOURCE_NAME}.openai.azure.com/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
      defaultQuery: { "api-version": "2024-02-15-preview" },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_API_KEY!,
      },
    })
  }

  async generateResponse(query: string, context: any): Promise<string> {
    try {
      const systemPrompt = `
        당신은 국회 활동 전문가입니다. 
        사용자의 질문에 대해 정확하고 객관적인 정보를 제공하세요.
        제공된 컨텍스트 정보를 바탕으로 답변하되, 정치적 편향 없이 중립적으로 답변하세요.
      `

      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `질문: ${query}\n\n관련 정보: ${JSON.stringify(context)}` },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      return response.choices[0]?.message?.content || "죄송합니다. 답변을 생성할 수 없습니다."
    } catch (error) {
      console.error("OpenAI API error:", error)
      throw error
    }
  }

  async summarizeTranscript(transcript: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "국회 회의록을 간결하고 이해하기 쉽게 요약해주세요. 주요 발언과 핵심 내용을 중심으로 정리하세요.",
          },
          { role: "user", content: transcript },
        ],
        temperature: 0.3,
        max_tokens: 500,
      })

      return response.choices[0]?.message?.content || "요약을 생성할 수 없습니다."
    } catch (error) {
      console.error("Transcript summarization error:", error)
      throw error
    }
  }
}
