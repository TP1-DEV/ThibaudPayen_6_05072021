import {Request, Response, Router} from 'express'
import fs from 'fs'
import multer from '../../middleware/multer.middleware'
import auth from '../auth/auth.services'
import Controller from '../../interfaces/controllers.interface'
import Sauce from './sauce.models'
import {RequestCustom} from '../auth/auth.interfaces'

export default class SauceController implements Controller {
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

  public async getAllSauces(req: Request, res: Response) {
    try {
      const sauces = await Sauce.find()
      res.status(200).json(sauces)
    } catch (error) {
      res.status(500).json({error})
    }
  }

  public async getOneSauce(req: Request, res: Response) {
    try {
      const sauce = await Sauce.findOne({_id: req.params.id})
      if (sauce !== null) {
        res.status(200).json(sauce)
      } else {
        res.status(404).json({message: 'Sauce non trouvée !'})
      }
    } catch (error) {
      res.status(500).json({error})
    }
  }

  public async createSauce(req: Request, res: Response) {
    try {
      const sauceObject = JSON.parse(req.body.sauce)
      if (req.file !== undefined) {
        await Sauce.create({
          ...sauceObject,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })
        res.status(201).json({message: 'Sauce ajoutée !'})
      } else {
        res.status(403).json({message: 'Fichier non trouvé !'})
      }
    } catch (error) {
      res.status(500).json({error})
    }
  }

  public async modifySauce(req: Request, res: Response) {
    try {
      const sauce = await Sauce.findOne({_id: req.params.id})
      if (sauce !== null && req.body.userId === sauce.userId) {
        const sauceObject = req.file
          ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
          : {...req.body}
        await Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        res.status(200).json({message: 'Sauce modifiée !'})
      } else {
        res.status(403).json({message: 'Non autorisé'})
      }
    } catch (error) {
      res.status(500).json({error})
    }
  }

  public async deleteSauce(req: Request, res: Response) {
    try {
      const reqCustom = req as RequestCustom
      const sauce = await Sauce.findOne({_id: req.params.id})
      if (sauce !== null && reqCustom.userId === sauce.userId) {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`../backend/src/assets/images/${filename}`, async () => {
          await Sauce.deleteOne({_id: req.params.id})
          res.status(200).json({message: 'Sauce supprimée !'})
        })
      } else {
        res.status(404).json({message: 'Sauce non trouvée !'})
      }
    } catch (error) {
      res.status(500).json({error})
    }
  }

  public async likes(req: Request, res: Response) {
    try {
      const like = req.body.like
      const user = req.body.userId
      const sauce = await Sauce.findOne({_id: req.params.id})
      if (sauce !== null) {
        const usersLikedId = sauce.usersLiked.find((userId) => userId === user)
        const usersDislikedId = sauce.usersDisliked.find((userId) => userId === user)
        switch (like) {
          case 0:
            if (usersLikedId !== undefined) {
              await Sauce.updateOne(
                {_id: req.params.id}, 
                {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
              res.status(200).json({message: 'Avis supprimé'})
            } else if (usersDislikedId !== undefined) {
              await Sauce.updateOne(
                {_id: req.params.id},
                {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}}
              )
              res.status(200).json({message: 'Avis supprimé'})
            } else {
              res.status(403).json({message: 'Avis déjà supprimé !'})
            }
            break
          case 1:
            if (user !== usersLikedId) {
              await Sauce.updateOne(
                {_id: req.params.id}, 
                {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}})
              res.status(200).json({message: "J'aime"})
            } else {
              res.status(403).json({message: 'Sauce déjà like !'})
            }
            break
          case -1:
            if (user !== usersDislikedId) {
              await Sauce.updateOne(
                {_id: req.params.id},
                {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}}
              )
              res.status(200).json({message: "Je n'aime pas"})
            } else {
              res.status(403).json({message: 'Sauce déjà dislike !'})
            }
            break
        }
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
}
