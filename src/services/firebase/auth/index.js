import firebase from 'firebase/app'
import { Loading, Dialog } from 'quasar'
import { getProvider } from 'src/services/firebase/providers/github'

export const githubLogin = async () => {
  Loading.show({
    message: 'Waiting for GitHub authorization'
  })
  try {
    const authResult = await firebase.auth().signInWithPopup(getProvider())
    const login = firebase.functions().httpsCallable('api/auth/login')
    const user = {
      name: authResult.additionalUserInfo.username,
      uid: authResult.user.uid
    }
    await login(user)
  } catch (e) {
    if (e.code !== 'auth/popup-closed-by-user') {
      Dialog.create({
        title: 'Login Error',
        message: `An error occurred while trying to authenticate your GitHub account. Code: ${e.code}`
      })
    }
  } finally {
    Loading.hide()
  }
}
