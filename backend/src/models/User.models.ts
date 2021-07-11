import mongoose from 'mongoose'
import isEmail from 'validator/lib/isEmail'
import uniqueValidator from 'mongoose-unique-validator'

interface IUser extends Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, 
      lowercase: true, 
      trim: true, 
      unique: true, 
      validate: isEmail, 
      index: true, 
      required: true
    },
    password: {
      type: String, 
      required: true
    }
  },
  {
    timestamps: true
  }
  )

userSchema.plugin(uniqueValidator, {message: 'déjà utilisé'})

export default mongoose.model<IUser>('User', userSchema)
