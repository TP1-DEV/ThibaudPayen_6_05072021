import 'dotenv/config'
import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import ControllerInterface from './interfaces/controllers.interface'

export default class App {
  private app: express.Application

  constructor(controllers: ControllerInterface[]) {
    this.app = express()
    this.connectToTheDatabase()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  private connectToTheDatabase() {
    const {DB_USER, DB_PASSWORD, DB_PATH} = process.env
    try {
      mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_PATH}`, {useNewUrlParser: true, useUnifiedTopology: true})
    } catch (error) {
      throw new Error(error)
    }
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(helmet())
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
