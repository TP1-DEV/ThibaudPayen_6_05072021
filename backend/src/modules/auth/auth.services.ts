import 'dotenv/config'
import {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import DecodedToken from './auth.interfaces'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = typeof req.headers.authorization === 'string' ? req.headers.authorization.split(' ')[1] : ''
    const decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`) as DecodedToken
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      return 'Invalid user ID'
    } else {
      next()
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    })
  }
}
