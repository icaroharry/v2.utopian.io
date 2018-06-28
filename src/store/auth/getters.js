// imports.
import { get } from 'lodash-es'

// auth store getters.

// returns true if the user is not authenticated.
// returns false if hte user is authenticated / present.
export const guest = ({ user }) => (user === null)

// "check" is the inverse check of guest.
export const check = ({ user }) => !guest({ user })

// user data.
export const user = ({ user }) => user

// user UID (Firebase).
export const uid = ({ user }) => get(user, 'uid', null)

// username (also UID).
export const username = uid

// name (real or username).
export const name = ({ user }) => get(user, 'displayName', null)

// user photo url.
export const photoURL = ({ user }) => get(user, 'photoURL', null)
// avatar alias for the photo url getter.
export const avatar = photoURL

// account data.
export const account = ({ account }) => account

// get github data on account.
export const github = ({ account }) => get(account, 'github', null)
// github username.
export const githubUsername = ({ account }) => get(github({ account }), 'username', null)

// all credentials.
export const credentials = ({ credentials }) => credentials

// steem credentials.
export const steemCredentials = ({ credentials }) => get(credentials, 'steem', null)
// github credentials.
export const githubCredentials = ({ credentials }) => get(credentials, 'github', null)

// guest on steem.
export const steemGuest = ({ credentials }) => steemCredentials({ credentials }) !== null
// guest on github.
export const githubGuest = ({ credentials }) => githubCredentials({ credentials }) === null
