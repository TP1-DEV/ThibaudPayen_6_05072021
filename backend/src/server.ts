import App from './app'
import validateEnv from './utils/validateEnv'
import AuthController from './modules/auth/auth.controllers'
import SauceController from './modules/sauce/sauce.controllers'

validateEnv()

const app = new App([new AuthController(), new SauceController()])

app.listen()
