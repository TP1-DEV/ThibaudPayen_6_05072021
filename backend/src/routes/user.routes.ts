import {Router} from 'express'
import {signup, login} from '../controllers/user.controllers'

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)

export default userRouter
