const Axios = require('axios')

const getSteemConnectTokens = async (code) => {
  const response = await Axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'post',
    url: 'https://steemconnect.com/api/oauth2/token',
    data: {
      code,
      client_secret: `${process.env.STEEMCONNECT_CLIENT_SECRET}`
    }
  })
  if (response.status === 200 && response.data) {
    return response.data
  }
  return null
}

module.exports = {
  getSteemConnectTokens
}
