module.exports = {
  SC2_APP: (process.env.SC2_APP || '"utopian.signin"'),
  FIREBASE_API_KEY: (process.env.FIREBASE_API_KEY || 'null'),
  FIREBASE_PROJECT_ID: (process.env.FIREBASE_PROJECT_ID || '"utopian-io"'),
  FIREBASE_AUTH_DOMAIN: (process.env.FIREBASE_AUTH_DOMAIN || '"auth.utopian.io"'),
  FIREBASE_MESSAGING_SENDER_ID: (process.env.FIREBASE_MESSAGING_SENDER_ID || 'null'),
  STEEM_API: (process.env.STEEM_API || '"https://api.steemit.com"')
}
