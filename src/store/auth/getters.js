// imports.
import { isEmpty, get } from 'lodash-es'
import moment from 'moment'

// auth store getters.

export const githubUser = ({ github }) => github
export const steemUser = ({ steem }) => steem

export const steemAvatar = ({ steem }) => {
  const username = get(steem, 'username', null)

  return username ? `https://img.blocker.press/a/${username}` : null
}
export const githubAvatar = ({ github }) => get(github, 'photoURL', null)

// username getter.
export const steemUsername = ({ steem }) => steem.username
export const githubUsername = ({ github }) => github.username

// token expiration getter.
export const steemExpiration = ({ steem }) => steem.expiration

// access token getter.
export const steemToken = ({ steem }) => steem.expiration

// token expired.
export const steemTokenExpired = ({ steem }) => steem.expiration ? steem.expiration.isBefore(moment.utc()) : true

// empty user fields.
export const steemHasEmptyFields = ({ steem }) => {
  const { username, expiration, token } = steem
  return (isEmpty(username) || isEmpty(expiration) || isEmpty(token))
}

export const checkOnGithub = ({ github }) => github !== null
export const guestOnGithub = (state) => !checkOnGithub(state)

// check user session is valid.
export const checkOnSteem = (state) => (!steemHasEmptyFields(state) && !steemTokenExpired(state))

// guest (inverse of check).
export const guestOnSteem = (state) => !checkOnSteem(state)
