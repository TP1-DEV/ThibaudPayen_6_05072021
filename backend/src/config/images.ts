import express from 'express'
import path from 'path'

const app = express()

export default app.use('/images', express.static(path.join(__dirname, '../assets/images')))
