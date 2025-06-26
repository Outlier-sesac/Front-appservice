"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, BarChart3, PieChart, ScatterChartIcon as Scatter3D, Download, RefreshCw } from "lucide-react"
import { apiClient } from "@/config/api"

interface ClusterData {
  member_id: string
  member_name: string
  party: string
  cluster: number
  coordinates: [number, number]
  similarity: number
}

interface StatisticsData {
  total_members: number
  total_bills: number
  passed_bills: number
  rejected_bills: number
  pending_bills: number
  average_attendance: number
  most_active_member: string
  party_distribution: Record<string, number>
  committee_activity: Record<string, number>
}

export default function StatisticsPage() {
  const [clusterData, setClusterData] = useState<ClusterData[]>([])
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // 군집화 결과 가져오기
      const clusterResponse = await apiClient.getClusteringResults()
      setClusterData(clusterResponse.results || [])

      // 통계 데이터 가져오기 (실제 API 엔드포인트 필요)
      const statsData: StatisticsData = {
        total_members: 300,
        total_bills: 1247,
        passed_bills: 856,
        rejected_bills: 234,
        pending_bills: 157,
        average_attendance: 89.3,
        most_active_member: "김진표",
        party_distribution: {
          더불어민주당: 168,
          국민의힘: 114,
          정의당: 6,
          기본소득당: 3,
          무소속: 9,
        },
        committee_activity: {
          기획재정위원회: 45,
          법제사법위원회: 38,
          행정안전위원회: 32,
          교육위원회: 29,
          과학기술정보방송통신위원회: 25,
        },
      }
      setStatisticsData(statsData)
    } catch (error) {
      console.error("Failed to load statistics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const getClusterColor = (cluster: number) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ]
    return colors[cluster % colors.length]
  }

  const getPartyColor = (party: string) => {
    const partyColors: Record<string, string> = {
      더불어민주당: "bg-blue-600",
      국민의힘: "bg-red-600",
      정의당: "bg-yellow-600",
      기본소득당: "bg-green-600",
      무소속: "bg-gray-600",
    }
    return partyColors[party] || "bg-gray-500"
  }

  const filteredClusterData =
    selectedCluster === "all" ? clusterData : clusterData.filter((item) => item.cluster.toString() === selectedCluster)

  const uniqueClusters = [...new Set(clusterData.map((item) => item.cluster))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">통계 대시보드</h1>
                <p className="text-sm text-gray-500">국회 활동 현황 및 의원 군집화 분석</p>
              </div>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 전체 통계 요약 */}
          {statisticsData && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{statisticsData.total_members}</div>
                  <div className="text-sm text-gray-600">총 의원 수</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{statisticsData.total_bills}</div>
                  <div className="text-sm text-gray-600">총 법안 수</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{statisticsData.passed_bills}</div>
                  <div className="text-sm text-gray-600">가결</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{statisticsData.rejected_bills}</div>
                  <div className="text-sm text-gray-600">부결</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{statisticsData.pending_bills}</div>
                  <div className="text-sm text-gray-600">계류중</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{statisticsData.average_attendance}%</div>
                  <div className="text-sm text-gray-600">평균 출석률</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 군집화 시각화 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Scatter3D className="w-5 h-5" />
                    의원 군집화 분석
                  </CardTitle>
                  <CardDescription>표결 기록을 바탕으로 한 의원들의 정치적 성향 군집화 결과입니다</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedCluster} onValueChange={setSelectedCluster}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="클러스터 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueClusters.map((cluster) => (
                        <SelectItem key={cluster} value={cluster.toString()}>
                          클러스터 {cluster}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    내보내기
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 군집화 시각화 영역 */}
              <div className="relative bg-gray-50 rounded-lg p-6 mb-6" style={{ height: "500px" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 800 400" className="border rounded">
                    {/* 배경 격자 */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* 축 */}
                    <line x1="50" y1="350" x2="750" y2="350" stroke="#374151" strokeWidth="2" />
                    <line x1="50" y1="350" x2="50" y2="50" stroke="#374151" strokeWidth="2" />

                    {/* 축 레이블 */}
                    <text x="400" y="380" textAnchor="middle" className="text-sm fill-gray-600">
                      경제 정책 성향 (보수 ← → 진보)
                    </text>
                    <text
                      x="25"
                      y="200"
                      textAnchor="middle"
                      className="text-sm fill-gray-600"
                      transform="rotate(-90 25 200)"
                    >
                      사회 정책 성향 (보수 ← → 진보)
                    </text>

                    {/* 데이터 포인트 */}
                    {filteredClusterData.map((member, index) => {
                      const x = 50 + (member.coordinates[0] + 1) * 350 // -1~1을 50~750으로 변환
                      const y = 350 - (member.coordinates[1] + 1) * 150 // -1~1을 350~50으로 변환 (Y축 반전)

                      return (
                        <g key={member.member_id}>
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            className={`${getPartyColor(member.party)} opacity-80 hover:opacity-100`}
                            stroke="#fff"
                            strokeWidth="2"
                          />
                          <text
                            x={x}
                            y={y - 10}
                            textAnchor="middle"
                            className="text-xs fill-gray-700 font-medium"
                            style={{ fontSize: "10px" }}
                          >
                            {member.member_name}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* 범례 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statisticsData &&
                  Object.entries(statisticsData.party_distribution).map(([party, count]) => (
                    <div key={party} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${getPartyColor(party)}`}></div>
                      <span className="text-sm font-medium">{party}</span>
                      <span className="text-sm text-gray-500">({count}명)</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 클러스터별 상세 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  클러스터별 의원 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uniqueClusters.map((cluster) => {
                    const clusterMembers = clusterData.filter((item) => item.cluster === cluster)
                    const partyDistribution = clusterMembers.reduce(
                      (acc, member) => {
                        acc[member.party] = (acc[member.party] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    )

                    return (
                      <div key={cluster} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">클러스터 {cluster}</h4>
                          <Badge variant="outline">{clusterMembers.length}명</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(partyDistribution).map(([party, count]) => (
                            <Badge key={party} variant="secondary" className="text-xs">
                              {party}: {count}명
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          대표 의원:{" "}
                          {clusterMembers
                            .slice(0, 3)
                            .map((m) => m.member_name)
                            .join(", ")}
                          {clusterMembers.length > 3 && ` 외 ${clusterMembers.length - 3}명`}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 위원회별 활동 현황 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  위원회별 활동 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statisticsData && (
                  <div className="space-y-4">
                    {Object.entries(statisticsData.committee_activity)
                      .sort(([, a], [, b]) => b - a)
                      .map(([committee, count]) => (
                        <div key={committee} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{committee}</span>
                            <span className="text-sm text-gray-600">{count}건</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(count / Math.max(...Object.values(statisticsData.committee_activity))) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 분석 인사이트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                분석 인사이트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">정당별 응집도</h4>
                  <p className="text-sm text-blue-700">
                    더불어민주당과 국민의힘은 각각 뚜렷한 클러스터를 형성하며, 당론에 따른 표결 경향이 강하게
                    나타납니다.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">이념적 스펙트럼</h4>
                  <p className="text-sm text-green-700">
                    경제 정책과 사회 정책에서 진보-보수 스펙트럼이 명확히 구분되며, 일부 의원들은 중도적 성향을
                    보입니다.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">교차 투표 패턴</h4>
                  <p className="text-sm text-purple-700">
                    특정 이슈에서는 당론을 넘나드는 교차 투표가 관찰되며, 이는 의원 개인의 신념이나 지역 특성을
                    반영합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 관련 기능 */}
          <Card>
            <CardHeader>
              <CardTitle>더 알아보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/personality">
                  <Button variant="outline" className="w-full h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">성향 테스트</div>
                      <div className="text-sm text-gray-500">나의 정치 성향 확인</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/matching">
                  <Button variant="outline" className="w-full h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">의원 매칭</div>
                      <div className="text-sm text-gray-500">유사한 성향 의원 찾기</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/issues">
                  <Button variant="outline" className="w-full h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">이슈 분석</div>
                      <div className="text-sm text-gray-500">주제별 의원 입장</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/chatbot">
                  <Button variant="outline" className="w-full h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">AI 질문</div>
                      <div className="text-sm text-gray-500">궁금한 점 문의</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
