import config from './config/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import Controller from './interfaces/controllers.interface'

class App {
  public app: express.Application

  constructor(controllers: Controller[]) {
    this.app = express()

    this.connectToTheDatabase()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`)
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(cors)
    this.app.use(helmet())
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.app.use('/images', express.static(path.join(__dirname, '../assets/images')))
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }

  private async connectToTheDatabase() {
    try {
      await mongoose.connect(config.url, {useNewUrlParser: true, useUnifiedTopology: true})
      return console.log('Connexion à MongoDB réussie !')
    } catch (error) {
      return console.log('Connexion à MongoDB échouée !')
    }
  }

}

export default App
