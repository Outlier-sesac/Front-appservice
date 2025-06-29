// src/app/ping/page.tsx
"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/config/api"

export default function PingPage() {
  const [message, setMessage] = useState<string>("Loading...")

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const res = await apiClient.ping()
        setMessage(res.message)
      } catch (err) {
        console.error("API error:", err)
        setMessage("Error contacting API")
      }
    }

    fetchPing()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-bold">
      응답 메시지: {message}
    </div>
  )
}
