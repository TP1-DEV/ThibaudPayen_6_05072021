import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
require("dotenv").config()


export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (typeof req.headers.authorization === 'string') ? req.headers.authorization.split(' ')[1] : "";
    const decodedToken = jwt.verify(token, `${process.env.TOKEN}`);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};