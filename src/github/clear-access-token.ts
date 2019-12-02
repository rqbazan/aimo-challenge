import Cookie from 'js-cookie'
import config from '../config'

export default function clearAccessToken() {
  Cookie.remove(config.COOKIE_NAME)
}
