import 'dotenv/config'
import bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import {Request, Response, Router} from 'express'
import Controller from '../../interfaces/controllers.interface'
import User from '../user/user.models'

export default class AuthController implements Controller {
  public path = '/auth'
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.signup.bind(this))
    this.router.post(`${this.path}/login`, this.login.bind(this))
  }

  public cryptEmail(email: string): string | undefined {
    try {
      if (process.env.CRYPTOJS_KEY && process.env.CRYPTOJS_IV !== undefined) {
        const key = CryptoJS.enc.Base64.parse(process.env.CRYPTOJS_KEY)
        const iv = CryptoJS.enc.Base64.parse(process.env.CRYPTOJS_IV)
        const cryptedEmail = CryptoJS.AES.encrypt(email, key, {iv: iv}).toString()
        return cryptedEmail
      }
    } catch (error) {
      console.log(error)
    }
  }

  private async signup(req: Request, res: Response) {
    try {
      const validPassword = validator.isStrongPassword(req.body.password)
      const validEmail = validator.isEmail(req.body.email)
      if (validPassword && validEmail) {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const emailCrypted = this.cryptEmail(req.body.email)
        await User.create({
          email: emailCrypted,
          password: hashPassword
        })
        res.status(201).json({message: 'Utilisateur créé !'})
      }
    } catch (error) {
      console.log(error)
    }
  }

  private async login(req: Request, res: Response) {
    try {
      const email = this.cryptEmail(req.body.email)
      const user = await User.findOne({email: email})
      if (!user) {
        return res.status(401).json({error: 'Utilisateur non trouvé !'})
      }
      const valid = await bcrypt.compare(req.body.password, user.password)
      if (!valid) {
        return res.status(401).json({error: 'Mot de passe incorrect !'})
      }
      res.status(200).json({
        userId: user._id,
        token: jwt.sign({userId: user._id}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
      })
    } catch (error) {
      console.log(error)
    }
  }
}
