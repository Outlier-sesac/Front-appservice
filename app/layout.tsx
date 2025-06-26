import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "국회 모니터 - 시민 참여 기반 국회의원 활동 모니터링",
  description: "국회의원의 의정 활동을 투명하게 모니터링하고, 나와 비슷한 정치 성향의 의원을 찾아보세요",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
