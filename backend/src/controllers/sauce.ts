import Sauce from '../models/Sauce'
import fs from 'fs'
import {NextFunction, Request, Response} from 'express'

export const getAllSauces = (req: Request, res: Response, next: NextFunction) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(400).json({error: error})
    })
}

export const getOneSauce = (req: Request, res: Response, next: NextFunction) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      res.status(200).json(sauce)
    })
    .catch((error) => {
      res.status(404).json({error: error})
    })
}

export const createSauce = (req: Request, res: Response, next: NextFunction) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  if (req.file !== undefined) {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
    sauce
      .save()
      .then(() => res.status(201).json({message: 'Sauce ajoutée !'}))
      .catch((error) => res.status(400).json({error}))
  } else {
    throw 'Erreur sauce non ajoutée'
  }
}

export const modifySauce = (req: Request, res: Response, next: NextFunction) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : {...req.body}
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
    .catch((error) => res.status(400).json({error}))
}

export const deleteSauce = (req: Request, res: Response, next: NextFunction) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if (sauce !== null) {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`../backend/src/assets/images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
            .catch((error) => res.status(400).json({error}))
        })
      } else {
        throw 'Erreur sauce non supprimée'
      }
    })
    .catch((error) => res.status(500).json({error}))
}
