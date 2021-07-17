import App from './appNew'
import AuthController from './components/auth/auth.controllers'
import SauceController from './components/sauce/sauce.controllers'

const app = new App([new SauceController(), new AuthController()])

app.listen()
