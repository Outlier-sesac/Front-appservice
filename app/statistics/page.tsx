// src/app/statistics/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, BarChart3, PieChart, ScatterChartIcon as Scatter3D, Download, RefreshCw } from "lucide-react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
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
  const [hoveredMember, setHoveredMember] = useState<ClusterData | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const clusterResponse = await apiClient.getClusteringResults()
      setClusterData(clusterResponse.results || [])
      const statsData: StatisticsData = { /* stubbed statistics data */ total_members: 3, total_bills: 10, passed_bills: 6, rejected_bills: 2, pending_bills: 2, average_attendance: 95.4, most_active_member: "김진표", party_distribution: { 더불어민주당: 1, 국민의힘: 1, 정의당: 1 }, committee_activity: { 기획재정위원회: 2, 법제사법위원회: 1, 행정안전위원회: 1 } }
      setStatisticsData(statsData)
    } catch (error) {
      console.error("Failed to load statistics data:", error)
    } finally {
      setLoading(false)
    }
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

  const filteredClusterData = selectedCluster === "all" ? clusterData : clusterData.filter((item) => item.cluster.toString() === selectedCluster)
  const uniqueClusters = [...new Set(clusterData.map((item) => item.cluster))].sort()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> 홈으로
            </Button>
          </Link>
          <h1 className="text-xl font-bold">통계 대시보드</h1>
          <Button onClick={loadData} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} /> 새로고침
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scatter3D className="w-5 h-5" /> 군집화 시각화</CardTitle>
            <CardDescription>정치 성향 시각화</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
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
            </div>

            <div className="relative h-[500px] bg-white border rounded-md">
              <TransformWrapper>
                <TransformComponent>
                  <svg width={800} height={400} viewBox="0 0 800 400">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <line x1="50" y1="350" x2="750" y2="350" stroke="#374151" strokeWidth="2" />
                    <line x1="50" y1="350" x2="50" y2="50" stroke="#374151" strokeWidth="2" />
                    <text x="400" y="380" textAnchor="middle" className="text-sm fill-gray-600">
                      경제 정책 성향 (보수 ← → 진보)
                    </text>
                    <text x="25" y="200" textAnchor="middle" className="text-sm fill-gray-600" transform="rotate(-90 25 200)">
                      사회 정책 성향 (보수 ← → 진보)
                    </text>

                    {filteredClusterData.map((member) => {
                      const x = 50 + (member.coordinates[0] + 1) * 350
                      const y = 350 - (member.coordinates[1] + 1) * 150
                      return (
                        <g key={member.member_id}>
                          <circle
                            cx={x}
                            cy={y}
                            r={6}
                            className={`${getPartyColor(member.party)} opacity-80 hover:opacity-100 cursor-pointer`}
                            stroke="#fff"
                            strokeWidth={2}
                            onMouseEnter={() => setHoveredMember(member)}
                            onMouseLeave={() => setHoveredMember(null)}
                          />
                          <text x={x} y={y - 10} textAnchor="middle" className="text-xs fill-gray-700 font-medium" style={{ fontSize: "10px" }}>
                            {member.member_name}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </TransformComponent>
              </TransformWrapper>

              {hoveredMember && (
                <div
                  className="absolute z-10 bg-white border border-gray-300 shadow-md text-sm rounded px-2 py-1 pointer-events-none"
                  style={{
                    left: `${50 + (hoveredMember.coordinates[0] + 1) * 350}px`,
                    top: `${350 - (hoveredMember.coordinates[1] + 1) * 150 - 40}px`
                  }}
                >
                  <div className="font-semibold">{hoveredMember.member_name}</div>
                  <div className="text-gray-600">{hoveredMember.party}</div>
                  <div className="text-gray-500 text-xs">클러스터 {hoveredMember.cluster}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
