import multer from 'multer'
import slugify from 'slugify'

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, '../backend/src/assets/images')
  },
  filename: (req: any, file: any, cb: any) => {
    const name = slugify(file.originalname, {replacement: '_', lower: true})
    cb(null, `${Date.now()}-${name}`)
  }
})

export default multer({storage: storage}).single('image')
