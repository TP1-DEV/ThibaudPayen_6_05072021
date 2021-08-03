import mongoose from 'mongoose'
import User from './user.interfaces'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: true,
      lowercase: true,
      trim: true,
      unique: [true, 'Email déjà utilisé'],
      required: [true, 'Veuillez saisir votre email']
    },
    password: {
      type: String,
      required: [true, 'Veuillez saisir un mot de passe']
    }
  },
  {
    timestamps: true
  }
)

userSchema.plugin(uniqueValidator, {message: 'déjà utilisé'})

export default mongoose.model<User>('User', userSchema)
