// services/fastapi.ts에서
constructor() {
  this.baseUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"
}