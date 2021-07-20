import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, '../backend/src/assets/images')
  },
  filename: (req: any, file: any, cb: any) => {
    console.log(file)
    cb(null, `${file.originalname}-${Date.now()}`)
  }
})

export default multer({storage: storage}).single('image')
