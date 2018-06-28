// imports.
import * as secrets from 'src/database/tables/secrets'
import * as crypto from 'src/services/vault/crypto'
import { generateEncryptionKey } from 'src/services/vault/keys'
import { Loading, Dialog } from 'quasar'
// find the encryption key on database.
const findEncryptionKey = (generator) => secrets.find('app-key').then((key) => (key || generator()))

// store an encryption key on database.
const saveEncryptionKey = (key) => secrets.save('app-key', key)

// commit "trick".
const commitKey = (commit) => (key) => { commit('setEncryptionKey', key); return key }

// prepare the encrypted environment.
export const prepareEncryption = ({ state, commit }) => {
  // find or generate the encryption key.
  return findEncryptionKey(generateEncryptionKey)
    // commit the key on store.
    .then(commitKey(commit))
    // save the key on database, even if not new.
    .then(saveEncryptionKey)
    // return a generic error.
    .catch(() => Promise.reject(new Error('Error preparing encrypted environment')))
}

// encrypt some data.
export const encrypt = ({ getters }, data) => {
  return crypto.encrypt(getters.encryptionKey, data)
    .catch(() => Promise.reject(new Error('Encryption error.')))
}

// decrypt some data.
export const decrypt = ({ getters }, payload) => {
  return crypto.decrypt(getters.encryptionKey, payload)
    .catch(() => Promise.reject(new Error('Decryption error.')))
}

// start the loading indication (full overlay).
export const startLoading = (store, message) => {
  // default options
  Loading.show({ message })
}

// start the loading indication (full overlay).
export const stopLoading = (store, any) => {
  // default options
  Loading.hide()
}

// show a generic dialog (options to configure).
export const showDialog = (store, options) => {
  Dialog.create(options)
}
