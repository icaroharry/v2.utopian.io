export const guest = ({ user }) => (user === null)
export const user = ({ user }) => user
export const displayName = ({ user }) => user && user.displayName
export const avatar = ({ user }) => user && user.photoURL

export const getBlockchainActiveAccount = state => blockchain => {
  if (state.user && state.user.blockchainAccounts) {
    const blockchainAccount = state.user.blockchainAccounts.find(obj => obj.blockchain === blockchain && obj.active)
    if (blockchainAccount) {
      return blockchainAccount.address
    }
  }
  return null
}
