// import cache helper.
import { remember } from 'src/database/cache'

// import steem client account helper.
import { getAccount } from '../../../services/steem/account'

// load a given account.
export const loadAccount = ({ commit }, accountUser) => {
  const username = accountUser.replace('@', '')
  return remember(username, 10, () => getAccount(username))
    .then(account => {
      return account
    })
}
