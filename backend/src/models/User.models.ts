import mongoose from 'mongoose'
import validator from 'validator'
import uniqueValidator from 'mongoose-unique-validator'

interface User extends Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: true,
      lowercase: true,
      trim: true,
      unique: [true, 'Email déjà utilisé'],
      required: [true, 'Veuillez saisir votre email'],
      validate: [validator.isEmail, 'Veuillez saisir un email valide']
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
