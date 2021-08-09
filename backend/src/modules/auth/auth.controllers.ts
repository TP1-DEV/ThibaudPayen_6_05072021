import 'dotenv/config'
import bcrypt from 'bcrypt'
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
    this.router.post(`${this.path}/signup`, this.signup)
    this.router.post(`${this.path}/login`, this.login)
  }

  private async signup(req: Request, res: Response) {
    try {
      const validPassword = validator.isStrongPassword(req.body.password)
      const validEmail = validator.isEmail(req.body.email)
      if (validPassword && validEmail) {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
          email: req.body.email,
          password: hashPassword
        })
        res.status(201).json({message: 'Utilisateur créé !'})
      }
    } catch (error) {
      res.status(500).json({error})
    }
  }

  private async login(req: Request, res: Response) {
    try {
      const user = await User.findOne({email: req.body.email})
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
      res.status(500).json({error})
    }
  }
}
