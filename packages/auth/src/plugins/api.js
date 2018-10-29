import axios from 'axios'
import jwt from 'jsonwebtoken'
// import { Cookies } from 'quasar'

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
      if (err.response.status === 401) {
        // TODO bad token remove logged user and token from store
        // Cookies.remove('access_token')
        // Cookies.remove('refresh_token')
      // Validation errors
      } else if (err.response.status === 422) {
        return {
          error: err.response.data.message
        }
      }
      return err.response.data
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
            // TODO unlog the user from the store and destroy all the tokens
            // Cookies.remove('access_token')
            // Cookies.remove('refresh_token')
          }
        }
      } else {
        headers['Authorization'] = accessToken
      }
    }
    return headers
  }
}
