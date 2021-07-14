import {Router} from 'express'
import {getAllSauces, getOneSauce, createSauce, modifySauce, deleteSauce, likes} from '../controllers/sauce.controllers'

import auth from '../middleware/auth'
import multer from '../middleware/multer'

const sauceRouter = Router()

sauceRouter.get('/', auth, getAllSauces)
sauceRouter.get('/:id', auth, getOneSauce)
sauceRouter.post('/', auth, multer, createSauce)
sauceRouter.put('/:id', auth, multer, modifySauce)
sauceRouter.delete('/:id', auth, deleteSauce)
sauceRouter.post('/:id/like', auth, likes)

export default sauceRouter
