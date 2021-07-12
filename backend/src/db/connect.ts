import mongoose from 'mongoose'
import config from '../config/config'

export default () => {
  try {
    mongoose.connect(config.url, {useNewUrlParser: true, useUnifiedTopology: true})
    return console.log('Connexion à MongoDB réussie !')
  } catch (error) {
    return console.log('Connexion à MongoDB échouée !')
  }
}
