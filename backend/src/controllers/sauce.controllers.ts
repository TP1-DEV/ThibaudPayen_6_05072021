import Sauce from '../models/Sauce.models'
import fs from 'fs'
import {Request, Response} from 'express'

export const getAllSauces = async (req: Request, res: Response) => {
  try {
    const sauces = await Sauce.find()
    res.status(200).json(sauces)
  } catch (error) {
    res.status(404).json({error: error})
  }
}

export const getOneSauce = async (req: Request, res: Response) => {
  try {
    const sauce = await Sauce.findOne({_id: req.params.id})
    res.status(200).json(sauce)
  } catch (error) {
    res.status(404).json({error: error})
  }
}

export const createSauce = async (req: Request, res: Response) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce)
    if (req.file !== undefined) {
      await Sauce.create({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      })
      res.status(201).json({message: 'Sauce ajoutée !'})
    } else {
      throw 'Erreur: image non reconnue'
    }
  } catch (error) {
    res.status(400).json({error})
  }
}

export const modifySauce = async (req: Request, res: Response) => {
  try {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
      : {...req.body}
    await Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    res.status(200).json({message: 'Sauce modifiée !'})
  } catch (error) {
    res.status(400).json({error})
  }
}

export const deleteSauce = async (req: Request, res: Response) => {
  try {
    const sauce = await Sauce.findOne({_id: req.params.id})
    if (sauce !== null) {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`../backend/src/assets/images/${filename}`, async () => {
        await Sauce.deleteOne({_id: req.params.id})
        res.status(200).json({message: 'Sauce supprimée !'})
      })
    } else {
      res.status(400).json({message: 'Sauce non trouvée !'})
    }
  } catch (error) {
    res.status(500).json({error})
  }
}
