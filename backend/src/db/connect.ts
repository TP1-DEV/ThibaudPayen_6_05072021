import mongoose from 'mongoose'
import config from '../config/config'

export async function connect(): Promise<void> {
  try {
    await mongoose.connect(config.url, {useNewUrlParser: true, useUnifiedTopology: true})
    return console.log('Connexion à MongoDB réussie !')
  } catch (e) {
    return console.log('Connexion à MongoDB échouée !')
  }
}
