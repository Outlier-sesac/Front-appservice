"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, Minus, Users, TrendingUp } from "lucide-react"

const sampleBills = [
  {
    id: 1,
    title: "기후위기 대응을 위한 탄소중립·녹색성장 기본법",
    description: "2050년 탄소중립 달성을 위한 법적 기반 마련",
    category: "환경",
  },
  {
    id: 2,
    title: "부동산 투기 방지를 위한 종합부동산세 강화법",
    description: "다주택자에 대한 세금 부담 증가",
    category: "부동산",
  },
  {
    id: 3,
    title: "최저임금 인상법",
    description: "최저임금을 시간당 12,000원으로 인상",
    category: "노동",
  },
]

export default function MatchingPage() {
  const [selectedBills, setSelectedBills] = useState<Record<number, "agree" | "disagree" | "abstain">>({})
  const [showResults, setShowResults] = useState(false)

  const handleVote = (billId: number, vote: "agree" | "disagree" | "abstain") => {
    setSelectedBills((prev) => ({
      ...prev,
      [billId]: vote,
    }))
  }

  const handleShowResults = () => {
    if (Object.keys(selectedBills).length > 0) {
      setShowResults(true)
    }
  }

  if (showResults) {
    return <MatchingResults selectedBills={selectedBills} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
              <h1 className="text-xl font-bold text-gray-900">입장 기반 의원 매칭</h1>
              <p className="text-sm text-gray-500">주요 법안에 대한 입장으로 유사한 의원을 찾아보세요</p>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>주요 법안에 대한 입장을 선택해주세요</CardTitle>
              <CardDescription>선택한 입장을 바탕으로 유사하거나 반대되는 성향의 의원을 찾아드립니다</CardDescription>
            </CardHeader>
          </Card>

          {sampleBills.map((bill) => (
            <Card key={bill.id}>
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">
                  {bill.category}
                </Badge>
                <CardTitle className="text-lg leading-tight">{bill.title}</CardTitle>
                <CardDescription>{bill.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={selectedBills[bill.id] === "agree" ? "default" : "outline"}
                    onClick={() => handleVote(bill.id, "agree")}
                    className="justify-start h-auto p-3"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    찬성
                  </Button>
                  <Button
                    variant={selectedBills[bill.id] === "disagree" ? "destructive" : "outline"}
                    onClick={() => handleVote(bill.id, "disagree")}
                    className="justify-start h-auto p-3"
                  >
                    <X className="w-4 h-4 mr-2" />
                    반대
                  </Button>
                  <Button
                    variant={selectedBills[bill.id] === "abstain" ? "secondary" : "outline"}
                    onClick={() => handleVote(bill.id, "abstain")}
                    className="justify-start h-auto p-3"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    기권
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <Button onClick={handleShowResults} disabled={Object.keys(selectedBills).length === 0} size="lg">
              매칭 결과 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MatchingResults({ selectedBills }: { selectedBills: Record<number, "agree" | "disagree" | "abstain"> }) {
  const similarMembers = [
    { name: "김진표", party: "더불어민주당", region: "서울 종로구", similarity: 100, matches: 3 },
    { name: "이재명", party: "더불어민주당", region: "경기 성남시", similarity: 67, matches: 2 },
    { name: "박홍근", party: "더불어민주당", region: "서울 중구", similarity: 67, matches: 2 },
  ]

  const oppositeMembers = [
    { name: "한동훈", party: "국민의힘", region: "서울 동작구", similarity: 0, matches: 0 },
    { name: "주호영", party: "국민의힘", region: "대구 수성구", similarity: 33, matches: 1 },
    { name: "김기현", party: "국민의힘", region: "울산 북구", similarity: 33, matches: 1 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">매칭 결과</h1>
              <p className="text-sm text-gray-500">선택한 입장과 유사한 의원들을 찾았습니다</p>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 입장 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                선택한 입장 요약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleBills.map((bill) => {
                  const vote = selectedBills[bill.id]
                  if (!vote) return null

                  return (
                    <div key={bill.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {bill.category}
                        </Badge>
                        <Badge
                          variant={vote === "agree" ? "default" : vote === "disagree" ? "destructive" : "secondary"}
                        >
                          {vote === "agree" ? "찬성" : vote === "disagree" ? "반대" : "기권"}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm leading-tight">{bill.title}</h4>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 유사한 의원들 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  유사한 입장의 의원
                </CardTitle>
                <CardDescription>선택한 입장과 비슷한 표결을 한 의원들입니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {similarMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          {member.party} · {member.region}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{member.matches}개 법안 일치</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{member.similarity}%</div>
                        <div className="text-xs text-gray-500">일치율</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 반대 성향 의원들 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  반대 입장의 의원
                </CardTitle>
                <CardDescription>선택한 입장과 다른 표결을 한 의원들입니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {oppositeMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          {member.party} · {member.region}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{member.matches}개 법안 일치</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{member.similarity}%</div>
                        <div className="text-xs text-gray-500">일치율</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 상세 분석 */}
          <Card>
            <CardHeader>
              <CardTitle>상세 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">정치적 성향 분석</h4>
                  <div className="space-y-2 text-sm">
                    <p>• 환경 정책에 적극적인 입장</p>
                    <p>• 부동산 규제 강화 지지</p>
                    <p>• 노동자 권익 보호 중시</p>
                    <p>• 전반적으로 진보적 성향</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">추천 행동</h4>
                  <div className="space-y-2 text-sm">
                    <p>• 유사한 성향 의원의 다른 법안 확인</p>
                    <p>• 지역구 의원과의 입장 비교</p>
                    <p>• 관련 시민단체 활동 참여 고려</p>
                    <p>• 정기적인 의정 활동 모니터링</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-x-4">
            <Link href="/personality">
              <Button size="lg">전체 성향 테스트 해보기</Button>
            </Link>
            <Link href="/chatbot">
              <Button variant="outline" size="lg">
                더 자세히 알아보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
