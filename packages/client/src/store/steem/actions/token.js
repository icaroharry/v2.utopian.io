export const prepareClient = ({ dispatch }) => {
  // TODO remove when steem actions are refactored
  return Promise.resolve()
  /*
  return Promise.resolve()
    .then(encryptedToken => {
      const token = get(encryptedToken, 'secret', null)
      if (token) {
        return dispatch('decrypt', token, { root: true })
          .then((token) => {
            const client = clone(baseClient)
            client.setAccessToken(token)
            return client
          })
      }
      return Promise.reject(new Error('no steem credentials'))
    })
    */
}
