import ext from './ext'
import decode from 'jwt-decode'

export const setCookie = async () => {
  return new Promise((resolve, reject) => {
    ext.cookies.get({ url: 'http://staging.utopian.io', name: 'access_token' }, (cookies) => {
      if (!cookies) {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        return resolve(false)
      }
      const { iss, username, exp, scopes } = decode(cookies.value)
      if (iss === 'utopian.io' && exp < Date.now() && scopes.includes('app')) {
        localStorage.setItem('token', cookies.value)
        localStorage.setItem('username', username)
        resolve(true)
      }
      else {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        resolve(false)
      }
    })
  })
}
