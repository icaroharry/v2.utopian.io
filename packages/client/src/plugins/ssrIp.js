/**
 * Record the user IP to be able to transmit it to the API Wrapper in an ssr context
 *
 * @param store
 * @param ssrContext
 */
export default async ({ store, ssrContext }) => {
  if (ssrContext) {
    const request = ssrContext.req
    const xFF = request.headers['x-forwarded-for']
    await store.dispatch('utils/setSSRIp', xFF ? xFF.split(',')[0] : request.connection.remoteAddress)
  }
}
