import App from '../app'
import AuthController from '../modules/auth/auth.controllers'
import SauceController from '../modules/sauce/sauce.controllers'
import request from 'supertest'
import {MongoMemoryServer} from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'

let app: App
let db_instance: MongoMemoryServer

beforeAll(async () => {
  db_instance = await MongoMemoryServer.create()
  const uri = db_instance.getUri()
  process.env.DB_URL = uri.slice(0, uri.lastIndexOf('/')) + '/soPekocko'
  app = new App([new AuthController(), new SauceController()])
})

afterAll(async () => {
  await (await app.getConnection()).disconnect()
  await db_instance.stop()
})

describe('POST /api/auth/signup', () => {
  test('it should create new User and save it in DB', (done) => {
    request(app.getApp())
    .post('/api/auth/signup')
    .send({email: 'test123@test.com', password: 'V?9m4YTc|a]2'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201, done)
  })
})

describe('POST /api/auth/login', () => {
  test('it should log in User', (done) => {
    request(app.getApp())
    .post('/api/auth/login')
    .send({email: 'test123@test.com', password: 'V?9m4YTc|a]2'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done)
  })
})

describe('GET /api/sauces', () => {
  test('it should show all sauces from db', (done) => {
    const userId = '60fa7ebef2efc61fc44b763c'
    const token = jwt.sign({userId: userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    request(app.getApp())
    .get('/api/sauces')
    .send({userId: userId})
    .auth(token, {type: 'bearer'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done)
  })
})

describe('POST /api/sauces', () => {
  test('it should add sauce in db', (done) => {
    const userId = '60fa7ebef2efc61fc44b763c'
    const token = jwt.sign({userId: userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    request(app.getApp())
      .post('/api/sauces')
      .attach('image', './src/tests/test.png')
      .field('sauce', JSON.stringify({
        name: 'MyName',
        manufacturer: 'MyManufacturer',
        description: 'MyDesc',
        mainPepper: 'Tomato',
        heat: 7,
        userId: '60fa7ebef2efc61fc44b763c'
      }))
      .auth(token, {type: 'bearer'})
      .expect('Content-Type', /json/)
      .expect(201, done)
  })
})

describe('GET /api/sauces/:id', () => {
  test("it should show specific sauce from db", (done) => {
    const userId = '60fa7ebef2efc61fc44b763c'
    const token = jwt.sign({userId: userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    request(app.getApp())
    .get('/api/sauces/60f7efd4a95e68342801549b')
    .send({userId: userId})
    .auth(token, {type: 'bearer'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done)
  })
})

describe('PUT /api/sauces/:id', () => {
  test("it should modify specific sauce from db", (done) => {
    const userId = '60fa7ebef2efc61fc44b763c'
    const token = jwt.sign({userId: userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    request(app.getApp())
    .put('/api/sauces/60f7efd4a95e68342801549b')
    .send({
      userId: userId,
      name: 'MyNameZ',
      manufacturer: 'ThisManufacturerZ',
      description: 'DescZ',
      mainPepper: 'Tomatoz',
      heat: 10,
    })
    .auth(token, {type: 'bearer'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done)
  })
})

describe('DELETE /api/sauces/:id', () => {
  test("it should delete specific sauce from db", (done) => {
    const userId = '60fa7ebef2efc61fc44b763c'
    const token = jwt.sign({userId: userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    request(app.getApp())
    .delete('/api/sauces/60f7efd4a95e68342801549b')
    .auth(token, {type: 'bearer'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done)
  })
})

describe('POST /api/sauces/:id/like', () => {
  test("it should add like or dislike to specific sauce from db", (done) => {
    const userId = '60fa7ebef2efc61fc44b763c'
    const token = jwt.sign({userId: userId}, `${process.env.SECRET_KEY}`, {expiresIn: '24h'})
    request(app.getApp())
    .post('/api/sauces/60f7efd4a95e68342801549b')
    .send({
      userId: userId,
      likes: 1
    })
    .auth(token, {type: 'bearer'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done)
  })
})
