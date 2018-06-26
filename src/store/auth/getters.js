// imports.
import { isEmpty, get } from 'lodash-es'
import moment from 'moment'

// auth store getters.

// user getter.
export const user = ({ user }) => user

// user photo url / avatar.
export const photoURL = ({ user }) => get(user, 'photoURL', null)

// steem user getter.
export const steemUser = ({ steemUser }) => steemUser

// user or guest.
export const guest = ({ user }) => user === null

export const steemAvatar = ({ steemUser }) => {
  const username = get(steemUser, 'username', null)

  return username ? `https://img.blocker.press/a/${username}` : null
}
export const githubAvatar = ({ github }) => get(github, 'photoURL', null)

// username getter.
export const steemUsername = ({ steemUser }) => get(steemUser, 'username')
export const githubUsername = ({ github }) => get(github, 'username')

// token expiration getter.
export const steemExpiration = ({ steemUser }) => get(steemUser, 'expiration')

// access token getter.
export const steemToken = ({ steemUser }) => get(steemUser, 'token')

// token expired.
export const steemTokenExpired = ({ steemUser }) => {
  const expiration = steemExpiration({ steemUser })

  if (!expiration) {
    return true
  }

  return moment.utc(expiration).isBefore(moment.utc())
}

// empty user fields.
export const steemHasEmptyFields = ({ steemUser }) => {
  if (!steemUser) {
    return true
  }
  const { username, expiration, token } = steemUser
  return (isEmpty(username) || isEmpty(expiration) || isEmpty(token))
}

export const checkOnGithub = ({ github }) => github !== null
export const guestOnGithub = (state) => !checkOnGithub(state)

// check user session is valid.
export const checkOnSteem = (state) => (!steemHasEmptyFields(state) && !steemTokenExpired(state))

// guest (inverse of check).
export const guestOnSteem = (state) => !checkOnSteem(state)
