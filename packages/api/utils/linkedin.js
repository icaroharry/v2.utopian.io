const Axios = require('axios')
const Boom = require('boom')

const requestLinkedinAccessToken = async (code) => {
  try {
    const response = await Axios({
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: 'https://www.linkedin.com/oauth/v2/accessToken',
      data:
        `client_id=${encodeURIComponent(process.env.LINKEDIN_CLIENT_ID)}&` +
        `client_secret=${encodeURIComponent(process.env.LINKEDIN_CLIENT_SECRET)}&` +
        `redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URL)}&` +
        `grant_type=${encodeURIComponent('authorization_code')}&` +
        `code=${encodeURIComponent(code)}`
    })
    if (response.status === 200 && response.data.access_token) {
      return response.data.access_token
    }

    throw Boom.badData('linkedin.getUserPermission')
  } catch (err) {
    throw Boom.badData('linkedin.getUserPermission')
  }
}

const getLinkedinUserInformation = async (token) => {
  try {
    const linkedinResponse = await Axios({
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      url: `https://api.linkedin.com/v1/people/~:(id,picture-url,email-address)?format=json`
    })

    if (linkedinResponse.status === 200 && linkedinResponse.data) {
      return linkedinResponse.data
    }

    throw Boom.badData('linkedin.getUserData')
  } catch (err) {
    throw Boom.badData('linkedin.getUserData')
  }
}

module.exports = {
  requestLinkedinAccessToken,
  getLinkedinUserInformation
}
