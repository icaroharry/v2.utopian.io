export const hasCredential = state => name => state.credentials.some(credential => credential.name === name)
export const getCredentialAccountName = state => name => {
  const cred = state.credentials.find(credential => credential.name === name)
  if (name === 'steem') {
    return cred.meta.username
  }
  return ''
}
export const getBlockchainActiveAccount = state => blockchain => {
  if (state.user && state.user.blockchainAccounts) {
    const blockchainAccount = state.user.blockchainAccounts.find(obj => obj.blockchain === blockchain && obj.active)
    if (blockchainAccount) {
      return blockchainAccount.address
    }
  }
  return null
}
