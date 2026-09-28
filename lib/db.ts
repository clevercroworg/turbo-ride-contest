import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn("[v0] DATABASE_URL is not set in environment.")
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
})

pool.on("error", (err) => {
  console.error("[Database Pool Error]:", err)
})
