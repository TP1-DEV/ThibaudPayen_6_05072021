import config from '../../config/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {Request, Response, Router} from 'express'
import Controller from '../../interfaces/controllers.interface'
import User from '../user/user.models'

class AuthController implements Controller {
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
      const hashPassword = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({
        email: req.body.email,
        password: hashPassword
      })
      if (user !== null) {
        res.status(201).json({message: 'Utilisateur créé !'})
      } else {
        res.status(400).json({message: 'Utilisateur non créé !'})
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
        token: jwt.sign({userId: user._id}, config.token, {expiresIn: '24h'})
      })
    } catch (error) {
      res.status(500).json({error})
    }
  }
}

export default AuthController
