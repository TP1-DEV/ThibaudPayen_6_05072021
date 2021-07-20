import {cleanEnv, port, str} from 'envalid'

export default () => {
  cleanEnv(process.env, {
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_PATH: str(),
    SECRET_KEY: str(),
    HOST: str(),
    PORT: port()
  })
}
