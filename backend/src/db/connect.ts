import mongoose from 'mongoose'
import config from '../config/config'

const connect = async () => {
  try {
    await mongoose.connect(config.url, {useNewUrlParser: true, useUnifiedTopology: true})
    return console.log('Connexion à MongoDB réussie !')
  } catch (error) {
    return console.log('Connexion à MongoDB échouée !')
  }
}
 export default connect