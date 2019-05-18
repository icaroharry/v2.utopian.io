import aesjs from 'aes-js'
import API from 'src/plugins/api'

export const transferToLocalStorage = ({ state, commit }) => {
  state.localStorageData.forEach(obj => {
    localStorage.setItem(obj.key, obj.value)
  })
  commit('clearLocalStorageValues')
}

export const getCategories = async (context, lang) => {
  if (context.rootState.utils.categories.length === 0) {
    const payload = await API.call({
      context,
      method: 'get',
      url: `/v1/categories/${lang}`
    })
    context.commit('setCategories', payload)
  }
}

export const getLanguages = async (context) => {
  if (context.rootState.utils.languages.length === 0) {
    const payload = await API.call({
      context,
      method: 'get',
      url: '/v1/languages'
    })
    context.commit('setLanguages', payload)
  }
}

export const clearAppError = ({ commit }) => commit('setAppError', null)
export const setAppError = ({ commit }, value) => commit('setAppError', value)
export const clearAppSuccess = ({ commit }) => commit('setAppSuccess', null)
export const setAppSuccess = ({ commit }, value) => commit('setAppSuccess', value)
export const setSSRIp = ({ commit }, value) => commit('setSSRIp', value)

/**
 * Remove the stored steem posting key that have expired or if the encryption key was reset
 * TODO manage multiple accounts
 */
export const clearInvalidKeys = ({ commit }, encryptionKey) => {
  if (localStorage.blockchainAccounts) {
    try {
      const accounts = JSON.parse(localStorage.blockchainAccounts)
      // Key expired?
      if (accounts[0].expirationDate && new Date(accounts[0].expirationDate).getTime() < Date.now()) {
        localStorage.removeItem('blockchainAccounts')
        commit('setAppError', 'api.errors.profile.keyExpired')
      // Encryption key reset
      } else {
        const key = aesjs.utils.utf8.toBytes(encryptionKey)
        const iv = aesjs.utils.utf8.toBytes(localStorage.iv)
        // eslint-disable-next-line
        const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
        const encryptedBytes = aesjs.utils.hex.toBytes(accounts[0].encryptedKey)
        const decryptedBytes = aesCbc.decrypt(encryptedBytes)
        if (aesjs.utils.utf8.fromBytes(decryptedBytes).indexOf('ut-') !== 0) {
          localStorage.removeItem('blockchainAccounts')
          commit('setAppError', 'api.errors.profile.encryptionKeyReset')
        }
      }
    } catch (e) {}
  }
  commit('auth/setSteemStatus', !!localStorage.blockchainAccounts, { root: true })
}
