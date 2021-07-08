import express from 'express'
const router = express.Router()

import auth from '../middleware/auth'
import multer from '../middleware/multer'

import {getAllSauces, getOneSauce, createSauce, modifySauce, deleteSauce} from '../controllers/sauce.controllers'

router.get('/', auth, getAllSauces)
router.get('/:id', auth, getOneSauce)
router.post('/', auth, multer, createSauce)
router.put('/:id', auth, multer, modifySauce)
router.delete('/:id', auth, deleteSauce)

export default router
