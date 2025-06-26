// 데이터베이스 설정

import sql from "mssql"

const config: sql.config = {
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    encrypt: true, // Azure SQL Database 필수
    trustServerCertificate: false,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getDbConnection() {
  if (!pool) {
    pool = new sql.ConnectionPool(config)
    await pool.connect()
  }
  return pool
}

export async function closeDbConnection() {
  if (pool) {
    await pool.close()
    pool = null
  }
}
