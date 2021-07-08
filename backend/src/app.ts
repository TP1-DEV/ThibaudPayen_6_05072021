import config from './config/config'

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'

import sauceRoutes from './routes/sauce.routes'
import userRoutes from './routes/user.routes'

const app = express()

mongoose
  .connect(config.url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, '/assets/images')))

app.listen(config.port, config.host, () => {
  console.log(`Listening at http://${config.host}:${config.port}`)
})
