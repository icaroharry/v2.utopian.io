import axios from 'axios'
import jwt from 'jsonwebtoken'
import { Cookies } from 'quasar'

export default class API {
  static async call ({ context, method, url, data }) {
    try {
      const headers = await API.prepareHeader(context)
      const response = await axios({
        headers,
        method,
        url: `${process.env.UTOPIAN_API}${url}`,
        data
      })
      if (response.status === 200 && response.data.data) {
        return response.data.data
      }
    } catch (err) {
      if (!err.response) {
        context.commit('utils/setAppError', 'unexpected', { root: true })
      // Token not valid anymore
      } else if (err.response.data.statusCode === 401) {
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        context.commit('auth/clear', { root: true })
        context.commit('utils/setAppError', 'api.errors.unauthorized', { root: true })
      // Validation errors
      } else if (err.response.data.statusCode === 422) {
        context.commit('utils/setAppError', `api.errors.${err.response.data.message}`, { root: true })
      }
    }
    return null
  }

  static async prepareHeader (context) {
    const headers = {
      'Accept': 'application/json'
    }
    const { accessToken, refreshToken } = context.rootState.api
    if (accessToken) {
      const decodedToken = jwt.decode(accessToken)
      // The access token has expired
      if (decodedToken.exp < Date.now() / 1000) {
        if (refreshToken) {
          try {
            const response = await axios.post(`${process.env.UTOPIAN_API}/oauth/token`, {
              code: refreshToken,
              grant_type: 'refresh_token'
            })
            if (response.status === 200 && response.data.access_token) {
              context.commit('api/setTokens', {
                accessToken: response.data.access_token,
                refreshToken
              }, { root: true })
              headers['Authorization'] = response.data.access_token
            }
          } catch (err) {
            Cookies.remove('access_token')
            Cookies.remove('refresh_token')
            context.commit('auth/clear', { root: true })
          }
        }
      } else {
        headers['Authorization'] = accessToken
      }
    }
    return headers
  }
}
