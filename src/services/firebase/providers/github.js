// import firebase.
import firebase from 'firebase/app'

// named export.
export const getProvider = () => {
  // create a github provider instance.
  const githubProvider = new firebase.auth.GithubAuthProvider()

  // add public organization read-only access.
  githubProvider.addScope('read:org')
  githubProvider.addScope('repo')

  // return the build provider.
  return githubProvider
}

// default export.
export default getProvider
