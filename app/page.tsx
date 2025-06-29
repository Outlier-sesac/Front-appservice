"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Users, MessageSquare, Volume2, TrendingUp } from "lucide-react"

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleTTS = () => {
    if ("speechSynthesis" in window) {
      const text =
        "여러분의 의정 파트너를 찾아드립니다. 국회의원의 활동을 투명하게 모니터링하고, 나와 비슷한 정치 성향의 의원을 찾아보세요."
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "ko-KR"
      utterance.rate = 0.9

      if (isPlaying) {
        speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        speechSynthesis.speak(utterance)
        setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">국회 모니터</h1>
                <p className="text-sm text-gray-500">Assembly Monitor</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleTTS} className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              {isPlaying ? "정지" : "읽어주기"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">여러분의 의정 파트너를 찾아드립니다</h2>
          <p className="text-xl text-gray-600 mb-8">
            국회의원의 활동을 투명하게 모니터링하고, 나와 비슷한 정치 성향의 의원을 찾아보세요
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="secondary" className="px-3 py-1">
              표결 기록 분석
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              AI 회의록 요약
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              성향 매칭
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              접근성 지원
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 지역구로 시작 */}
            <Link href="/region">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">지역구로 시작</CardTitle>
                      <CardDescription>내 지역 의원 활동 확인</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    지역구를 선택하여 해당 의원의 표결 기록, 주요 발언, 관련 법안을 한눈에 확인하세요.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* 이슈로 시작 */}
            <Link href="/issues">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Search className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">이슈로 시작</CardTitle>
                      <CardDescription>관심 주제별 분석</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    기후위기, 부동산, 교육 등 관심 있는 이슈에 대한 국회의 입장과 관련 법안을 탐색하세요.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* 나의 성향 찾기 */}
            <Link href="/personality">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">나의 성향 찾기</CardTitle>
                      <CardDescription>정치 성향 테스트</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    주요 법안에 대한 찬반 의견을 통해 나와 비슷한 성향의 의원을 찾아보세요.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* 입장으로 시작 */}
            <Link href="/matching">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">입장으로 시작</CardTitle>
                      <CardDescription>의견 기반 매칭</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    특정 법안에 대한 나의 입장을 선택하고, 유사하거나 반대되는 의원을 찾아보세요.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* 챗봇으로 질문하기 */}
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">챗봇으로 질문</CardTitle>
                    <CardDescription>AI 기반 질의응답</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  국회 회의록과 표결 기록을 바탕으로 궁금한 점을 자연어로 질문하세요.
                </p>
                <div className="mt-4 text-center">
                  <Button
                    asChild
                    variant="outline"
                    className="text-xs px-2 py-1 h-auto"
                  >
                    <a
                      href="https://outlier.koreacentral.cloudapp.azure.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      챗봇으로 질문
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

          
            {/* 통계 대시보드 */}
            <Link href="/statistics">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">통계 대시보드</CardTitle>
                      <CardDescription>국회 활동 현황 및 군집화</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">이번 달 처리 법안</span>
                      <span className="font-semibold">127건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">평균 출석률</span>
                      <span className="font-semibold">89.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">활발한 의원</span>
                      <span className="font-semibold">김○○</span>
                    </div>
                    <div className="mt-4 text-center">
                      <Button
                        asChild
                        variant="outline"
                        className="text-xs px-2 py-1 h-auto"
                      >
                        <a
                          href="https://outlier-profile.koreacentral.cloudapp.azure.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          군집화 분석 보기
                        </a>
                      </Button>
                    </div>
                   

                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">주요 기능</h3>
            <p className="text-lg text-gray-600">기존 서비스와 차별화된 혁신적인 기능들</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">표결 기반 군집화</h4>
              <p className="text-gray-600">주요 법안 찬반 기록으로 유사 성향 의원 그룹을 시각화합니다.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">AI 회의록 요약</h4>
              <p className="text-gray-600">전체 회의록에서 의원의 실제 발언 내용을 AI로 요약합니다.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">성향 매칭</h4>
              <p className="text-gray-600">사용자의 정치적 입장과 유사한 의원을 추천합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">국회 모니터</h5>
              <p className="text-gray-400">시민 참여 기반 국회의원 활동 모니터링 서비스</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">주요 기능</h5>
              <ul className="space-y-2 text-gray-400">
                <li>표결 기록 분석</li>
                <li>회의록 AI 요약</li>
                <li>성향 매칭</li>
                <li>접근성 지원</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">데이터 출처</h5>
              <ul className="space-y-2 text-gray-400">
                <li>국회 의안정보시스템</li>
                <li>국회 회의록</li>
                <li>공공데이터포털</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 국회 모니터. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
