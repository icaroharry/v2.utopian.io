import firebase from 'firebase/app'

export const getProvider = () => {
  const provider = new firebase.auth.GithubAuthProvider()
  provider.addScope('repo')
  provider.addScope('read:user')
  return provider
}

export default getProvider
