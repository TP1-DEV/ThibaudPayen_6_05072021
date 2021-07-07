import * as dotenv from 'dotenv'

dotenv.config()

interface Config {
  [key: string]: string
}

export const defaultConfig: Config = {
  path: process.env.DB_PATH ?? '',
  admin: process.env.DB_ADMIN ?? '',
  pwd: process.env.DB_PASSWORD ?? '',
  url: process.env.DB_URL ?? '',
  token: process.env.TOKEN ?? '',
}
