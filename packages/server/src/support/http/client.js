// imports.
import { get } from 'lodash'
// import axios
import axios from 'axios'
// node http and https agents.
import { Agent } from 'https'

// create a new http agent instance with keep-alive enabled.
const httpAgent = new Agent({ keepAlive: true })

// axios options.
const options = { httpAgent: httpAgent, httpsAgent: httpAgent }

// create an axios instance.
const instance = axios.create(options)

// // flatten success responses body.
const flattenSuccess = response => get(response, 'data', {})
// // flatten error responses body.
// const flattenError = error => Promise.reject(get(error, 'response.data', {}))
const flattenError = error => error

// enable success and error interceptors.
instance.interceptors.response.use(flattenSuccess, flattenError)

// set application/json as the default content-type header.
instance.defaults.headers.post['Content-Type'] = 'application/json'

// named export.
/** @type {AxiosInstance} */
export const http = instance

// default export.
/** @type {AxiosInstance} */
export default instance
