import App from '../app'
import AuthController from '../modules/auth/auth.controllers'
import SauceController from '../modules/sauce/sauce.controllers'
import request from 'supertest'
import {MongoMemoryServer} from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'
import User from '../modules/user/user.models'
import bcrypt from 'bcrypt'
import Sauce from '../modules/sauce/sauce.models'

let app: App
let dbInstance: MongoMemoryServer

beforeEach(async () => {
  dbInstance = await MongoMemoryServer.create()
  const uri = dbInstance.getUri()
  process.env.DB_URL = uri.slice(0, uri.lastIndexOf('/')) + '/soPekocko'
  app = new App([new AuthController(), new SauceController()])
  const hashPassword = await bcrypt.hash('V?9m4YTc|a]2', 10)
  await User.create({
    email: 'test123@test.com',
    password: hashPassword
  })
})

afterEach(async () => {
  await (await app.getConnection()).disconnect()
  await dbInstance.stop()
})

describe('POST /api/auth/signup', () => {
  test('it should create new User and save it in DB', () => {
    return request(app.getApp())
      .post('/api/auth/signup')
      .send({email: 'jest.test@test.com', password: 'V?9m4YTc|a]2'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
  })
  test('it should show error 500 user already exist', async () => {
    const hashPassword = await bcrypt.hash('V?9m4YTc|a]2', 10)
    await User.create({
      email: 'jest.test@test.com',
      password: hashPassword
    })
    return request(app.getApp())
      .post('/api/auth/signup')
      .send({email: 'jest.test@test.com', password: 'V?9m4YTc|a]2'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
  })
})

describe('POST /api/auth/login', () => {
  test('it should log in User', async () => {
    const hashPassword = await bcrypt.hash('V?9m4YTc|a]2', 10)
    await User.create({
      email: 'jest.test@test.com',
      password: hashPassword
    })
    return request(app.getApp())
      .post('/api/auth/login')
      .send({email: 'jest.test@test.com', password: 'V?9m4YTc|a]2'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('it should show error status 401 when trying to log in with invalid password', async () => {
    const hashPassword = await bcrypt.hash('V?9m4YTc|a]2', 10)
    await User.create({
      email: 'jest.test@test.com',
      password: hashPassword
    })
    return request(app.getApp())
      .post('/api/auth/login')
      .send({email: 'jest.test@test.com', password: 'password'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
  })
  test('it should show error status 401 when trying to log in unknown User', async () => {
    return request(app.getApp())
      .post('/api/auth/login')
      .send({email: 'unknown.user@test.com', password: 'V?9m4YTc|a]2'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
  })
})

describe('GET /api/sauces', () => {
  test('it should show all sauces from db', async () => {
    const token = jwt.sign({user: 'test123@test.com'}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .get('/api/sauces')
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})

describe('POST /api/sauces', () => {
  test('it should add sauce in db', async () => {
    const token = jwt.sign({user: 'test123@test.com'}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post('/api/sauces')
      .attach('image', './src/tests/test.png')
      .field('sauce', JSON.stringify({
          name: 'MyName',
          manufacturer: 'MyManufacturer',
          description: 'MyDesc',
          mainPepper: 'Tomato',
          heat: 7,
          userId: '60fa7ebef2efc61fc44b763c'
        })
      )
      .auth(token, {type: 'bearer'})
      .expect('Content-Type', /json/)
      .expect(201)
  })
  test('it should show error status 403 when trying to add sauce in db without file', async () => {
    const token = jwt.sign({user: 'test123@test.com'}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post('/api/sauces')
      .field('sauce', JSON.stringify({
          name: 'MyName',
          manufacturer: 'MyManufacturer',
          description: 'MyDesc',
          mainPepper: 'Tomato',
          heat: 7,
          userId: '60fa7ebef2efc61fc44b763c'
        })
      )
      .auth(token, {type: 'bearer'})
      .expect('Content-Type', /json/)
      .expect(403)
  })
})

describe('GET /api/sauces/:id', () => {
  test('it should show specific sauce from db', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .get(`/api/sauces/${sauce._id}`)
      .send({userId: sauce.userId})
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('it should show error status 404 when trying to show unknown sauce from db', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .get(`/api/sauces/wrongSauceId`)
      .send({userId: sauce.userId})
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
  })
})

describe('PUT /api/sauces/:id', () => {
  test('it should modify specific sauce from db', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .put(`/api/sauces/${sauce._id}`)
      .send({
        userId: '60fa7ebef2efc61fc44b763c',
        name: 'MyNameZ',
        manufacturer: 'ThisManufacturerZ',
        description: 'DescZ',
        mainPepper: 'Tomatoz',
        heat: 10
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('it should show error status 403 when trying to modify specific sauce from db with no correct userId', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .put(`/api/sauces/${sauce._id}`)
      .send({
        name: 'MyNameZ',
        manufacturer: 'ThisManufacturerZ',
        description: 'DescZ',
        mainPepper: 'Tomatoz',
        heat: 10
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
  })
})

describe('DELETE /api/sauces/:id', () => {
  test('it should delete specific sauce from db', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .delete(`/api/sauces/${sauce._id}`)
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('it should show error status 404 when trying to delete unknown sauce from db', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .delete(`/api/sauces/wrongSauceId`)
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
  })
})

describe('POST /api/sauces/:id/like', () => {
  test('it should add like +1 to specific sauce ', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post(`/api/sauces/${sauce._id}/like`)
      .send({
        userId: '60fa7ebef2efc61fc44b763c',
        like: 1
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('it should add dislike +1 to specific sauce', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post(`/api/sauces/${sauce._id}/like`)
      .send({
        userId: '60fa7ebef2efc61fc44b763c',
        like: -1
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('it should remove like 0 from specific sauce', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img',
      usersLiked: ['60fa7ebef2efc61fc44b763c']
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post(`/api/sauces/${sauce._id}/like`)
      .send({
        userId: '60fa7ebef2efc61fc44b763c',
        like: 0
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('it should remove dislike 0 from specific sauce', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img',
      usersDisliked: ['60fa7ebef2efc61fc44b763c']
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post(`/api/sauces/${sauce._id}/like`)
      .send({
        userId: '60fa7ebef2efc61fc44b763c',
        like: 0
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('it should show error status 403 already deleted', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img'
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post(`/api/sauces/${sauce._id}/like`)
      .send({
        userId: '60fa7ebef2efc61fc44b763c',
        like: 0
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
  })
  test('it should show error status 403 already liked', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img',
      usersLiked: ['60fa7ebef2efc61fc44b763c']
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post(`/api/sauces/${sauce._id}/like`)
      .send({
        userId: '60fa7ebef2efc61fc44b763c',
        like: 1
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
  })
  test('it should show error status 403 already disliked', async () => {
    const sauce = await Sauce.create({
      name: 'MyName',
      manufacturer: 'MyManufacturer',
      description: 'MyDesc',
      mainPepper: 'Tomato',
      heat: 7,
      userId: '60fa7ebef2efc61fc44b763c',
      imageUrl: 'img',
      usersDisliked: ['60fa7ebef2efc61fc44b763c']
    })
    const token = jwt.sign({userId: sauce.userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    return request(app.getApp())
      .post(`/api/sauces/${sauce._id}/like`)
      .send({
        userId: '60fa7ebef2efc61fc44b763c',
        like: -1
      })
      .auth(token, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
  })
})
