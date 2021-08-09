import 'dotenv/config'
import {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import {DecodedToken, RequestCustom} from './auth.interfaces'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = typeof req.headers.authorization === 'string' ? req.headers.authorization.split(' ')[1] : ''
    const decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`) as DecodedToken
    const reqCustom = req as RequestCustom
    reqCustom.userId = decodedToken.userId
    next()
  } catch (error) {
    res.status(401).json({error})
  }
}
