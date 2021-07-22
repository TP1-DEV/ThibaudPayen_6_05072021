import 'dotenv/config'
import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import limiter from './middleware/ratelimit.middleware'
import {cleanEnv, port, str} from 'envalid'
import ControllerInterface from './interfaces/controllers.interface'

export default class App {
  private app: express.Application
  public connection!: Promise<mongoose.Mongoose>

  constructor(controllers: ControllerInterface[]) {
    this.app = express()
    this.initEnv()
    this.connectToTheDatabase()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  private initEnv() {
    cleanEnv(process.env, {
      DB_USER: str(),
      DB_PASSWORD: str(),
      DB_PATH: str(),
      SECRET_KEY: str(),
      HOST: str(),
      PORT: port()
    })
  }

  public getApp() {
    return this.app
  }

  private connectToTheDatabase() {
    const {DB_USER, DB_PASSWORD, DB_PATH, DB_URL} = process.env
    try {
      const url = DB_URL ?? `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_PATH}`
      this.connection = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
      return this.connection
    } catch (error) {
      throw new Error(error)
    }
  }

  public getConnection() {
    return this.connection
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(mongoSanitize())
    this.app.use(limiter)
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.app.use('/images', express.static(path.join(__dirname, './assets/images')))
  }

  private initializeControllers(controllers: ControllerInterface[]) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router)
    })
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`)
    })
  }
}
