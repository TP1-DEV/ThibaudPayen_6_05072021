import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

interface IUser extends Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
})

userSchema.plugin(uniqueValidator)

export default mongoose.model<IUser>('User', userSchema)
