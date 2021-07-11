import config from './config/config'
import {connect} from './db/connect'
import routes from './routes/routes'
import images from './config/images'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(routes)
app.use(images)

const port = parseInt(config.port, 10)
const host = config.host

app.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`)
  connect()
})
