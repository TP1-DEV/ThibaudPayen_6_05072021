import {Router} from 'express'
import userRouter from './user.routes'
import sauceRouter from './sauce.routes'

const routes = Router()

routes.use('/api/auth', userRouter)
routes.use('/api/sauces', sauceRouter)

export default routes
