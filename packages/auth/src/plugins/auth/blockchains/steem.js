export default async ({ currentRoute, store, redirectUrl }) => {
  const code = currentRoute.query.code
  if (code) {
    await store.dispatch('blockchainSteem/linkAccount', { code })
  }
}
