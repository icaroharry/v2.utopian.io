import { Cookies } from 'quasar'
import gitHubLogin from './providers/github'
import linkSteemAccount from './blockchains/steem'
import { atob } from 'b2a'

/**
 * Manages the authentication and linking blockchain accounts
 * Authentication and utopian account creation is handled first if needed
 * Then we load the access token to have access tp authenticated endpoints
 * We handle callbacks that requires an account
 *
 * @param currentRoute
 * @param store
 * @param redirect
 * @param ssrContext
 * @returns {Promise<void>}
 */
export default async ({ currentRoute, store, redirect, ssrContext }) => {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies

  // Login with any external provider
  const state = currentRoute.query.state || ''
  const stateVariables = atob(state).split('::')
  const loginState = stateVariables[0]
  const redirectUrl = stateVariables[1]
  if (loginState === 'githublogin') {
    await gitHubLogin({ currentRoute, store, redirect, ssrContext, redirectUrl })
  } else {
    // Prepare the tokens to enable authenticated calls to the API
    if (cookies.get('access_token')) {
      await store.dispatch('api/setTokens', {
        accessToken: cookies.get('access_token'),
        refreshToken: cookies.get('refresh_token')
      })
    }
  }

  // Link blockchain accounts
  if (loginState === 'steemconnectlogin') {
    await linkSteemAccount({ currentRoute, store, redirectUrl })
  }
}
