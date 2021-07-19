import {Request, Response, Router} from 'express'
import fs from 'fs'
import multer from '../../middleware/multer'
import auth from '../../middleware/auth'
import Controller from '../../interfaces/controllers.interface'
import Sauce from './sauce.models'

class SauceController implements Controller {
  public path = '/sauces'
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, auth, this.getAllSauces)
    this.router.get(`${this.path}/:id`, auth, this.getOneSauce)
    this.router.post(`${this.path}`, auth, multer, this.createSauce)
    this.router.put(`${this.path}/:id`, auth, multer, this.modifySauce)
    this.router.delete(`${this.path}/:id`, auth, this.deleteSauce)
    this.router.post(`${this.path}/:id/like`, auth, this.likes)
  }

  async getAllSauces(req: Request, res: Response) {
    try {
      const sauces = await Sauce.find()
      res.status(200).json(sauces)
    } catch (error) {
      res.status(404).json({error: error})
    }
  }

  async getOneSauce(req: Request, res: Response) {
    try {
      const sauce = await Sauce.findOne({_id: req.params.id})
      res.status(200).json(sauce)
    } catch (error) {
      res.status(404).json({error: error})
    }
  }

  async createSauce(req: Request, res: Response) {
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

  async modifySauce(req: Request, res: Response) {
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

  async deleteSauce(req: Request, res: Response) {
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

  async likes(req: Request, res: Response) {
    const like = req.body.like
    try {
      switch (like) {
        case 0:
          const sauce = await Sauce.findOne({_id: req.params.id})
          if (sauce !== null && sauce.likes === 1) {
            await Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
            res.status(200).json({message: 'Avis supprimé'})
          } else {
            await Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
            res.status(200).json({message: 'Avis supprimé'})
          }
          break
        case 1:
          await Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}})
          res.status(200).json({message: "J'aime"})
          break
        case -1:
          await Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}})
          res.status(200).json({message: "Je n'aime pas"})
          break
      }
    } catch (error) {
      res.status(500).json({message: 'error'})
    }
  }
}

export default SauceController
