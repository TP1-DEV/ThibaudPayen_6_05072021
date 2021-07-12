import config from '../config/config'
import bcrypt from 'bcrypt'
import User from '../models/User.models'
import jwt from 'jsonwebtoken'
import {Request, Response} from 'express'

export const signup = async (req: Request, res: Response) => {
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

export const login = async (req: Request, res: Response) => {
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
