import {Request} from 'express'

export interface DecodedToken {
  userId: string
}

export interface RequestCustom extends Request {
  userId: string
}
