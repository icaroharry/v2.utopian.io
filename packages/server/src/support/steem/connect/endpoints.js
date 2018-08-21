// URL protocol
export const protocol = 'https'
// URL domain.
export const domain = 'steemconnect.com'
// base URL.
export const baseURL = `${protocol}://${domain}`

// account endpoint
export const accountEndpoint = `${baseURL}/api/me`

/**
 * Endpoints export.
 * @type {{account: string}}
 */
export const endpoints = {
  account: accountEndpoint
}

// default export for endpoints.
export default endpoints