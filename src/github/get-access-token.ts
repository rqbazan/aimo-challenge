import Cookie from 'js-cookie'
import config from '../config'

export default function getAccessToken() {
  return Cookie.get(config.COOKIE_NAME)
}
