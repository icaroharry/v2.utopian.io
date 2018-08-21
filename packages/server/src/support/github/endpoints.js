// URL protocol
export const protocol = 'https'
// URL domain.
export const domain = 'api.github.com'
// base URL.
export const baseURL = `${protocol}://${domain}`

// account endpoint
export const accountEndpoint = `${baseURL}/user`

/**
 * Endpoints export.
 * @type {{account: string}}
 */
export const endpoints = {
  account: accountEndpoint
}

// default export for endpoints.
export default endpoints