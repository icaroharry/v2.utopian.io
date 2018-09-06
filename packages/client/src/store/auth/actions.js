import moment from 'moment/moment'
import API from 'src/services/api'
import firebase from 'firebase/app'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { Cookies } from 'quasar'

import { parseSteemConnectCallback } from 'src/services/steem/connect/parseCallback'
import credentialsModel from 'src/database/tables/credentials'

export const me = async (context) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: '/me'
  })
  context.commit('setUser', payload)
}

export const storeCredentials = ({ state, commit, dispatch }, { name, secret = null, meta = null, expiration = null }) => {
  return dispatch('encrypt', secret, { root: true })
    .then((encryptedSecret) => ({ name, secret: encryptedSecret, meta, expiration }))
    .then(preparedData => credentialsModel.save(name, preparedData))
    .then(() => dispatch('loadCredentials'))
}

export const loadCredentials = async ({ getters, commit }) => {
  let credentials = (await credentialsModel.all()) || null
  if (credentials) {
    credentials = credentials.filter(credential => credential.expiration === null || moment.utc(credential.expiration).isAfter(moment.utc()))
    commit('setCredentials', credentials || [])
  }
  return Promise.resolve()
}
export const getCredential = ({ state }, name) => state.credentials.find(credential => credential.name === name)

export const deleteCredential = ({ commit }, name) => {
  return credentialsModel.remove(name)
}

/**
 * Link steem action using SteemConnect.
 * Login consists of parsing steem connect callback data
 */
export const linkSteemAccount = ({ dispatch, commit }, steemConnectData) => {
  if (!steemConnectData) return
  const data = parseSteemConnectCallback(steemConnectData)
  return dispatch('storeCredentials', data)
    .then(() => dispatch('steem/prepareClient', null, { root: true })
      .then((client) => client.me())
      .then(user => dispatch('steem/setUserDetails', user, { root: true })))
}

export const logout = ({ dispatch, commit }) => {
  return firebase.auth().signOut()
    .then(async () => {
      await commit('clear')
      await dispatch('steem/setUserDetails', null, { root: true })
      await credentialsModel.clear()
    })
}

export const authorize = async ({ dispatch }, { code = '', ssrContext, redirect, store }) => {
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies

  if (code) {
    const { access_token: accessToken, refresh_token: refreshToken } = (await axios.post('/oauth/token', {
      grant_type: 'authorization_code', 
      code
    })).data

    const token = jwt.decode(accessToken)
    cookies.set('access_token', accessToken)
    cookies.set('refresh_token', refreshToken)

    await store.dispatch('api/setTokens', {
      accessToken,
      refreshToken
    })

    if (!token.username) {
      redirect('/users/create')
    } else if (token.scopes.includes('app')) {
      await store.dispatch('auth/me')
    }
  } else if (cookies.get('access_token')) {
    await store.dispatch('api/setTokens', {
      accessToken: cookies.get('access_token'),
      refreshToken: cookies.get('refresh_token')
    })

    await store.dispatch('auth/me')
  } else {
    // if there's no valid accessToken, the user will be redirected to the homepage and will be able to sign in again
    redirect('/')
  }
}