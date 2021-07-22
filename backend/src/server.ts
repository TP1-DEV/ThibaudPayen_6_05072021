import App from './app'
import AuthController from './modules/auth/auth.controllers'
import SauceController from './modules/sauce/sauce.controllers'

const app = new App([new AuthController(), new SauceController()])

app.listen()
