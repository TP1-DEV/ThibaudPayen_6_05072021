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
  usersLiked: string[]
  usersDisliked: string[]
}

export default Sauce