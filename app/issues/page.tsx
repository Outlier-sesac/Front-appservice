"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Search, TrendingUp, Users, FileText, Calendar } from "lucide-react"

const popularIssues = [
  { keyword: "기후위기", count: 45, trend: "up" },
  { keyword: "부동산", count: 38, trend: "up" },
  { keyword: "최저임금", count: 32, trend: "down" },
  { keyword: "교육", count: 28, trend: "up" },
  { keyword: "의료", count: 25, trend: "stable" },
  { keyword: "국방", count: 22, trend: "up" },
]

const issueData = {
  keyword: "기후위기",
  totalBills: 12,
  passedBills: 8,
  rejectedBills: 2,
  pendingBills: 2,
  supportRate: 73,
  oppositionRate: 18,
  abstentionRate: 9,
}

const relatedBills = [
  {
    title: "기후위기 대응을 위한 탄소중립·녹색성장 기본법",
    date: "2024.03.15",
    status: "가결",
    support: 187,
    opposition: 45,
    abstention: 18,
  },
  {
    title: "재생에너지 확대를 위한 전력시장 개편법",
    date: "2024.02.28",
    status: "가결",
    support: 165,
    opposition: 62,
    abstention: 23,
  },
  {
    title: "탄소세 도입을 위한 조세특례제한법 개정안",
    date: "2024.02.15",
    status: "부결",
    support: 98,
    opposition: 142,
    abstention: 10,
  },
  {
    title: "친환경 자동차 보급 확대법",
    date: "2024.01.30",
    status: "계류중",
    support: 0,
    opposition: 0,
    abstention: 0,
  },
]

const keyStatements = [
  {
    member: "김진표",
    party: "더불어민주당",
    date: "2024.03.12",
    statement:
      "기후위기 대응을 위한 적극적인 정책 추진의 중요성을 강조하며, 산업계와의 협력을 통한 단계적 전환 방안을 제시했습니다.",
  },
  {
    member: "이재명",
    party: "더불어민주당",
    date: "2024.03.08",
    statement: "탄소중립 목표 달성을 위한 구체적 로드맵의 필요성을 언급하고, 녹색 일자리 창출 방안을 제안했습니다.",
  },
  {
    member: "한동훈",
    party: "국민의힘",
    date: "2024.03.05",
    statement: "환경 보호의 중요성은 인정하나, 급진적 정책 변화가 경제에 미칠 부정적 영향을 우려한다고 밝혔습니다.",
  },
]

export default function IssuesPage() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      setSelectedIssue(searchKeyword)
    }
  }

  const handleIssueSelect = (keyword: string) => {
    setSelectedIssue(keyword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
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
              <h1 className="text-xl font-bold text-gray-900">이슈별 분석</h1>
              <p className="text-sm text-gray-500">관심 있는 주제의 국회 논의 현황을 확인하세요</p>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {!selectedIssue ? (
            <div className="space-y-8">
              {/* 검색 영역 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    이슈 검색
                  </CardTitle>
                  <CardDescription>관심 있는 키워드를 입력하여 관련 국회 활동을 확인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="예: 기후위기, 부동산, 교육, 의료..."
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={!searchKeyword.trim()}>
                      검색
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 인기 이슈 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    인기 이슈
                  </CardTitle>
                  <CardDescription>최근 가장 많이 논의되고 있는 주제들입니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {popularIssues.map((issue, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleIssueSelect(issue.keyword)}
                        className="h-auto p-4 justify-between hover:bg-gray-50"
                      >
                        <div className="text-left">
                          <div className="font-medium">{issue.keyword}</div>
                          <div className="text-sm text-gray-500">{issue.count}건의 논의</div>
                        </div>
                        <div className="flex items-center">
                          {issue.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {issue.trend === "down" && <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />}
                          {issue.trend === "stable" && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 이슈 개요 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">"{selectedIssue}" 관련 국회 활동</CardTitle>
                      <CardDescription>최근 6개월간의 논의 현황입니다</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedIssue(null)}>
                      다른 이슈 검색
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{issueData.totalBills}</div>
                      <div className="text-sm text-gray-600">총 법안 수</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{issueData.passedBills}</div>
                      <div className="text-sm text-gray-600">가결</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{issueData.rejectedBills}</div>
                      <div className="text-sm text-gray-600">부결</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{issueData.pendingBills}</div>
                      <div className="text-sm text-gray-600">계류중</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">찬성</span>
                      <span className="text-sm text-gray-600">{issueData.supportRate}%</span>
                    </div>
                    <Progress value={issueData.supportRate} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">반대</span>
                      <span className="text-sm text-gray-600">{issueData.oppositionRate}%</span>
                    </div>
                    <Progress value={issueData.oppositionRate} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">기권</span>
                      <span className="text-sm text-gray-600">{issueData.abstentionRate}%</span>
                    </div>
                    <Progress value={issueData.abstentionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 관련 법안 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      관련 법안
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedBills.map((bill, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm leading-tight flex-1">{bill.title}</h4>
                            <Badge
                              variant={
                                bill.status === "가결"
                                  ? "default"
                                  : bill.status === "부결"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="ml-2"
                            >
                              {bill.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Calendar className="w-3 h-3" />
                            {bill.date}
                          </div>
                          {bill.status !== "계류중" && (
                            <div className="text-xs text-gray-600">
                              찬성 {bill.support} · 반대 {bill.opposition} · 기권 {bill.abstention}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 주요 발언 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      주요 발언
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {keyStatements.map((statement, index) => (
                        <div key={index} className="border-l-4 border-green-200 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-sm">{statement.member}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {statement.party}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">{statement.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{statement.statement}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 관련 기능 */}
              <Card>
                <CardHeader>
                  <CardTitle>더 알아보기</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/personality">
                      <Button variant="outline" className="w-full h-auto p-4 justify-start">
                        <div className="text-left">
                          <div className="font-medium">나의 성향과 비교</div>
                          <div className="text-sm text-gray-500">이 이슈에 대한 나의 입장 확인</div>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/matching">
                      <Button variant="outline" className="w-full h-auto p-4 justify-start">
                        <div className="text-left">
                          <div className="font-medium">의견 기반 매칭</div>
                          <div className="text-sm text-gray-500">비슷한 입장의 의원 찾기</div>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/chatbot">
                      <Button variant="outline" className="w-full h-auto p-4 justify-start">
                        <div className="text-left">
                          <div className="font-medium">AI에게 질문</div>
                          <div className="text-sm text-gray-500">더 자세한 정보 문의</div>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
