// import lodash helpers.
import { get } from 'lodash'
// import http client (axios).
import { http as defaultHttpClient } from 'src/support/http/client'
// import endpoints.
import defaultEndpoints from './endpoints'

/**
 * Github client.
 */
export class GithubClient {
  /**
   * Github constructor.
   *
   * @param {?string}         token       Access token to authenticate requests with.
   * @param {?Object}         endpoints   Custom endpoints customize the access points list.
   * @param {?AxiosInstance}  httpClient  Custom HTTP client
   */
  constructor (token = null, endpoints = null, httpClient = null) {
    // set the access token or null.
    this.setToken(token)
    // set the custom endpoints or use the default list.
    this.setEndpoints(endpoints || defaultEndpoints)
    // set the custom http client of use the default client.
    this.setHttpClient(httpClient || defaultHttpClient)
  }

  /**
   * Set a custom access token.
   *
   * @param {?string} token
   *
   * @return {GithubClient}
   */
  setToken (token = null) {
    // assign the token on instance.
    this.token = token
    // fluent return.
    return this
  }

  /**
   * Set a custom http client.
   *
   * @param {AxiosInstance} httpClient
   *
   * @return {GithubClient}
   */
  setHttpClient (httpClient) {
    // assign the endpoints.
    this.http = httpClient
    // fluent return.
    return this
  }

  /**
   * Set custom endpoints.
   *
   * @param {Object} endpoints
   *
   * @return {GithubClient}
   */
  setEndpoints (endpoints) {
    // assign the endpoints.
    this.endpoints = endpoints
    // fluent return.
    return this
  }

  /**
   * Get a headers object to use on requests.
   *
   * @return {{Accept: string, ContentType: string, Authorization: string}}
   */
  getHeaders () {
    // start a headers object.
    const headers = {
      // accept and content-type headers for the request.
      Accept: ['application/vnd.github.v3+json', 'application/json'],
      ContentType: 'application/json'
    }
    // case an access token is present.
    if (this.token !== null) {
      // set on headers
      headers['Authorization'] = `token ${this.token}`
    }
    // return the built headers
    return headers
  }

  /**
   * Get account data.
   *
   * @return {Promise<Object>}
   */
  getAccount () {
    return this.http.get(this.endpoints.account, {
      headers: this.getHeaders()
    })
  }
}

// default export.
export default GithubClient
