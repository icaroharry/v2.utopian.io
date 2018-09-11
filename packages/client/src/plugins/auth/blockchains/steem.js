export default async ({ currentRoute, store }) => {
  const code = currentRoute.query.code
  if (code) {
    await store.dispatch('blockchainSteem/linkAccount', { code })
  }
}
