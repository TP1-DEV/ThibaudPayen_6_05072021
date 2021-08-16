import {Request} from 'express'
import multer from 'multer'
import slugify from 'slugify'

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, '../backend/src/assets/images')
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const name = slugify(file.originalname, {replacement: '_', lower: true})
    cb(null, `${Date.now()}-${name}`)
  }
})

export default multer({storage: storage}).single('image')
