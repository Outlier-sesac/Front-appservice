"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Check, X, Minus, Users, TrendingUp } from "lucide-react"

const bills = [
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
  {
    id: 4,
    title: "국민기초생활보장법 개정안",
    description: "기초생활수급자 선정기준 완화",
    category: "복지",
  },
  {
    id: 5,
    title: "디지털 플랫폼 공정화법",
    description: "온라인 플랫폼의 독점 방지 및 공정거래 확보",
    category: "경제",
  },
  {
    id: 6,
    title: "교육공무원법 개정안",
    description: "교사의 학생 생활지도 권한 강화",
    category: "교육",
  },
  {
    id: 7,
    title: "국방개혁법",
    description: "병역의무 복무기간 단축 및 처우 개선",
    category: "국방",
  },
  {
    id: 8,
    title: "의료법 개정안",
    description: "공공의료 확충 및 의료진 처우 개선",
    category: "의료",
  },
  {
    id: 9,
    title: "개인정보보호법 강화법",
    description: "개인정보 수집·이용에 대한 규제 강화",
    category: "정보보호",
  },
  {
    id: 10,
    title: "출산지원법",
    description: "출산 및 육아 지원금 대폭 확대",
    category: "출산·육아",
  },
]

export default function PersonalityTest() {
  const [currentBill, setCurrentBill] = useState(0)
  const [responses, setResponses] = useState<Record<number, "agree" | "disagree" | "abstain">>({})
  const [showResults, setShowResults] = useState(false)

  const handleResponse = (response: "agree" | "disagree" | "abstain") => {
    setResponses((prev) => ({
      ...prev,
      [bills[currentBill].id]: response,
    }))

    if (currentBill < bills.length - 1) {
      setCurrentBill(currentBill + 1)
    } else {
      setShowResults(true)
    }
  }

  const progress = ((currentBill + 1) / bills.length) * 100

  if (showResults) {
    return <PersonalityResults responses={responses} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
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
              <h1 className="text-xl font-bold text-gray-900">나의 성향 찾기</h1>
              <p className="text-sm text-gray-500">정치 성향 테스트</p>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                진행률: {currentBill + 1} / {bills.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="mb-2">
                  {bills[currentBill].category}
                </Badge>
                <span className="text-sm text-gray-500">
                  {currentBill + 1} / {bills.length}
                </span>
              </div>
              <CardTitle className="text-xl leading-tight">{bills[currentBill].title}</CardTitle>
              <CardDescription className="text-base">{bills[currentBill].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-6">이 법안에 대한 당신의 입장을 선택해주세요.</p>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => handleResponse("agree")}
                  variant="outline"
                  className="h-auto p-4 justify-start text-left hover:bg-green-50 hover:border-green-300"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">찬성</div>
                      <div className="text-sm text-gray-500">이 법안에 동의합니다</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleResponse("disagree")}
                  variant="outline"
                  className="h-auto p-4 justify-start text-left hover:bg-red-50 hover:border-red-300"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">반대</div>
                      <div className="text-sm text-gray-500">이 법안에 반대합니다</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleResponse("abstain")}
                  variant="outline"
                  className="h-auto p-4 justify-start text-left hover:bg-gray-50 hover:border-gray-300"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <Minus className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">기권</div>
                      <div className="text-sm text-gray-500">판단을 보류합니다</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">각 법안에 대한 당신의 솔직한 의견을 선택해주세요.</div>
        </div>
      </div>
    </div>
  )
}

function PersonalityResults({ responses }: { responses: Record<number, "agree" | "disagree" | "abstain"> }) {
  const similarMembers = [
    { name: "김진표", party: "더불어민주당", region: "서울 종로구", similarity: 92 },
    { name: "이재명", party: "더불어민주당", region: "경기 성남시", similarity: 89 },
    { name: "박홍근", party: "더불어민주당", region: "서울 중구", similarity: 87 },
    { name: "우원식", party: "더불어민주당", region: "서울 노원구", similarity: 85 },
    { name: "정청래", party: "더불어민주당", region: "경기 부천시", similarity: 83 },
  ]

  const oppositeMembers = [
    { name: "한동훈", party: "국민의힘", region: "서울 동작구", similarity: 15 },
    { name: "주호영", party: "국민의힘", region: "대구 수성구", similarity: 18 },
    { name: "김기현", party: "국민의힘", region: "울산 북구", similarity: 22 },
  ]

  const agreeCount = Object.values(responses).filter((r) => r === "agree").length
  const disagreeCount = Object.values(responses).filter((r) => r === "disagree").length
  const abstainCount = Object.values(responses).filter((r) => r === "abstain").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
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
              <h1 className="text-xl font-bold text-gray-900">나의 정치 성향 분석 결과</h1>
              <p className="text-sm text-gray-500">당신과 비슷한 의원들을 찾았습니다</p>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 성향 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                나의 표결 성향 요약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">{agreeCount}</div>
                  <div className="text-sm text-gray-600">찬성</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">{disagreeCount}</div>
                  <div className="text-sm text-gray-600">반대</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-600">{abstainCount}</div>
                  <div className="text-sm text-gray-600">기권</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>분석 결과:</strong> 당신은 진보적 성향이 강하며, 사회복지와 환경 정책에 적극적인 입장을
                  보입니다. 경제 정책에서는 공정성과 분배를 중시하는 경향이 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 유사한 의원들 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  나와 비슷한 의원 TOP 5
                </CardTitle>
                <CardDescription>당신의 표결 성향과 유사한 의원들입니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {similarMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          {member.party} · {member.region}
                        </div>
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
                  정반대 성향 의원 TOP 3
                </CardTitle>
                <CardDescription>당신과 가장 다른 입장을 가진 의원들입니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {oppositeMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          {member.party} · {member.region}
                        </div>
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
              <CardTitle>상세 분석 리포트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">정책 분야별 성향</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">환경 정책</span>
                      <Badge variant="secondary">진보</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">경제 정책</span>
                      <Badge variant="secondary">진보</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">사회 복지</span>
                      <Badge variant="secondary">진보</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">교육 정책</span>
                      <Badge variant="outline">중도</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">추천 행동</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• 환경 관련 법안에 지속적인 관심을 가져보세요</li>
                    <li>• 사회복지 정책 토론에 참여해보세요</li>
                    <li>• 지역구 의원과의 소통 기회를 만들어보세요</li>
                    <li>• 시민단체 활동 참여를 고려해보세요</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/matching">
              <Button size="lg" className="mr-4">
                의견 기반 매칭 해보기
              </Button>
            </Link>
            <Link href="/chatbot">
              <Button variant="outline" size="lg">
                챗봇으로 더 알아보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
