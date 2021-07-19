import App from './app'
import AuthController from './components/auth/auth.controllers'
import SauceController from './components/sauce/sauce.controllers'

const app = new App([new AuthController(), new SauceController()])

app.listen()
