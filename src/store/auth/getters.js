import { get } from 'lodash-es'

export const guest = ({ user }) => (user === null)
export const user = ({ user }) => user
export const uid = ({ user }) => get(user, 'id', null)
export const username = uid
export const displayName = ({ user }) => get(user, 'displayName', null)
export const avatar = ({ user }) => get(user, 'photoURL', null)
export const hasCredential = state => name => state.credentials.some(credential => credential.name === name)
export const getCredentialAccountName = state => name => {
  const cred = state.credentials.find(credential => credential.name === name)
  if (name === 'steem') {
    return cred.meta.username
  }
  return ''
}
