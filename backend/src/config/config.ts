import * as dotenv from 'dotenv'

dotenv.config()

interface Config {
  path: string,
  admin: string,
  pwd: string,
  url: string,
  token: string,
  host: string,
  port: number
}

export default {
  path: process.env.DB_PATH ?? '',
  admin: process.env.DB_ADMIN ?? '',
  pwd: process.env.DB_PASSWORD ?? '',
  url: process.env.DB_URL ?? '',
  token: process.env.TOKEN ?? '',
  host: process.env.HOST ?? '',
  port: process.env.PORT ?? 3000
} as Config
