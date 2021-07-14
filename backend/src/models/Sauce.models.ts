import mongoose from 'mongoose'

interface Sauce extends Document {
  userId: string
  name: string
  manufacturer: string
  description: string
  mainPepper: string
  imageUrl: string
  heat: number
  likes: number
  dislikes: number
  usersLiked: [string]
  usersDisliked: [string]
}

const sauceSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true
  },
  name: {
    type: String, 
    required: [true, 'Nom requis'],
    minLength: [3, '3 caractères minimum']
  },
  manufacturer: {
    type: String, 
    required: [true, 'Manufacturer requis'],
    minLength: [3, '3 caractères minimum']
  },
  description: {
    type: String, 
    required: [true, 'Description requise'],
    minLength: [3, '3 caractères minimum']
  },
  mainPepper: {
    type: String, 
    required: [true, 'Ingredient principal requis'],
    minLength: [3, '3 caractères minimum']
  },
  imageUrl: {
    type: String, 
    required: [true, 'Image requise'],
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
  usersLiked: {
    type: [String]
  },
  usersDisliked: {
    type: [String]
  }
})

export default mongoose.model<Sauce>('Sauce', sauceSchema)
