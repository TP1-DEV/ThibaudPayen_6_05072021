import 'dotenv/config'
import path from 'path'
import express, {Application} from 'express'
import mongoose, {Mongoose} from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import limiter from './middlewares/ratelimit.middleware'
import {cleanEnv, port, str} from 'envalid'
import ControllerInterface from './interfaces/controllers.interface'
import { Server } from 'http'

export default class App {
  public app: Application
  public connection!: Promise<Mongoose>

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

  private connectToTheDatabase() {
    try {
      const url =
        process.env.DB_URL ?? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_PATH}`
      this.connection = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
      console.log('Connection has been established successfully.')
      return this.connection
    } catch (error) {
      console.log('Unable to connect to the database:', error)
    }
  }

  public getConnection(): Promise<typeof mongoose> {
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

  public listen(): Server {
    return this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`)
    })
  }

  public getApp(): Application {
    return this.app
  }
}
