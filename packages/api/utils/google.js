const Axios = require('axios')
const Boom = require('boom')

const requestGoogleAccessToken = async (code) => {
  try {
    const response = await Axios({
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      url: 'https://www.googleapis.com/oauth2/v4/token',
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
        code
      }
    })
    if (response.status === 200 && response.data.access_token) {
      return response.data.access_token
    }

    throw Boom.badData('google.getUserPermission')
  } catch (err) {
    throw Boom.badData('google.getUserPermission')
  }
}

const getGoogleUserInformation = async (token) => {
  try {
    const googleResponse = await Axios({
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      url: `https://www.googleapis.com/userinfo/v2/me`
    })

    if (googleResponse.status === 200 && googleResponse.data) {
      return googleResponse.data
    }

    throw Boom.badData('google.getUserData')
  } catch (err) {
    throw Boom.badData('google.getUserData')
  }
}

module.exports = {
  requestGoogleAccessToken,
  getGoogleUserInformation
}
