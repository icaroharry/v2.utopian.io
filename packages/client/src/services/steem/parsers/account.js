import { get, attempt } from 'lodash-es'
import { formatReputation } from '../account'

export const parseAccount = (account) => {
  account._meta = attempt(() => JSON.parse(get(account, 'json_metadata', '{}') || '{}')) || {}
  account._about = get(account._meta, 'profile.about', null)
  account._name = get(account._meta, 'profile.name', null)
  account._location = get(account._meta, 'profile.location', null)
  // parsed author reputation.
  account._reputation = formatReputation(get(account, 'reputation'))
  return account
}
