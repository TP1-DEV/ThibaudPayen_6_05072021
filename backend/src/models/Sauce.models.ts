import mongoose from 'mongoose'

interface IUser extends Document {
  userId: string
  name: string
  manufacturer: string
  description: string
  mainPepper: string
  imageUrl: string
  heat: number
  likes: number
  dislikes: number
  userLiked: string
  userDislikes: string
}

const sauceSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true
  },
  name: {
    type: String, 
    required: true
  },
  manufacturer: {
    type: String, 
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  mainPepper: {
    type: String, 
    required: true
  },
  imageUrl: {
    type: String, 
    required: true
  },
  heat: {
    type: Number, 
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  userLiked: {
    type: [String]
  },
  userDislikes: {
    type: [String]
  }
})

export default mongoose.model<IUser>('Sauce', sauceSchema)
