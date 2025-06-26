"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, MessageSquare, Bot, User, Volume2 } from "lucide-react"
import { apiClient } from "@/config/api"

const sampleQuestions = [
  "기후위기 관련해 누가 무슨 발언을 했어?",
  "부동산 정책에 대한 국회의원들의 입장은?",
  "최저임금 인상에 찬성한 의원들은?",
  "김진표 의원의 최근 활동은?",
  "환경 관련 법안 처리 현황은?",
]

interface ChatMessage {
  type: "user" | "bot"
  message: string
  timestamp: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      message:
        "안녕하세요! 국회 활동에 대해 궁금한 점을 질문해주세요. 의원별 활동, 법안 정보, 표결 기록 등을 알려드릴 수 있습니다.",
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      type: "user",
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // GPU 서버의 챗봇 API 호출
      const response = await apiClient.chatbot(inputMessage, {
        conversation_history: messages.slice(-5), // 최근 5개 메시지만 컨텍스트로 전달
      })

      const botResponse: ChatMessage = {
        type: "bot",
        message: response.response || "죄송합니다. 응답을 생성할 수 없습니다.",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Chatbot API error:", error)

      const errorResponse: ChatMessage = {
        type: "bot",
        message: "죄송합니다. 현재 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "ko-KR"
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">국회 AI 챗봇</h1>
              <p className="text-sm text-gray-500">국회 활동에 대해 무엇이든 물어보세요</p>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 샘플 질문 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                추천 질문
              </CardTitle>
              <CardDescription>아래 질문들을 클릭하여 시작해보세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleQuestion(question)}
                    className="text-left h-auto p-2 whitespace-normal"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 채팅 영역 */}
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                대화
              </CardTitle>
            </CardHeader>

            {/* 메시지 목록 */}
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] ${
                      msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    } rounded-lg p-3`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.type === "bot" && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      {msg.type === "user" && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm">{msg.message}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className={`text-xs ${msg.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                            {msg.timestamp}
                          </div>
                          {msg.type === "bot" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTTS(msg.message)}
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* 입력 영역 */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="국회 활동에 대해 궁금한 점을 질문해보세요..."
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                AI가 실시간으로 국회 데이터를 분석하여 답변드립니다. 정확한 정보는 공식 자료를 확인해주세요.
              </div>
            </div>
          </Card>

          {/* 기능 안내 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>이런 질문을 할 수 있어요</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">의원별 활동</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "김진표 의원의 최근 발언은?"</li>
                    <li>• "이재명 의원이 찬성한 법안들은?"</li>
                    <li>• "○○ 의원의 출석률은?"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">이슈별 분석</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "기후위기 관련 법안 현황은?"</li>
                    <li>• "부동산 정책에 대한 각 당의 입장은?"</li>
                    <li>• "교육 관련 최근 논의사항은?"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">표결 기록</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "○○법에 찬성한 의원들은?"</li>
                    <li>• "최근 부결된 법안들은?"</li>
                    <li>• "당론과 다르게 표결한 의원은?"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">통계 정보</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "이번 달 처리된 법안 수는?"</li>
                    <li>• "가장 활발한 의원은?"</li>
                    <li>• "위원회별 활동 현황은?"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
