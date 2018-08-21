import { omit } from 'lodash'
import { Account } from 'src/domains/users/account'

export const handler = async (data) => {
  const account = new Account(data)
  let accountRef = await account.findById()
  if (!accountRef) {
    await account.save()
    accountRef = account
  }
  if (accountRef && !accountRef.name && data.name) {
    accountRef.name = data.name
    await accountRef.update()
  }
  return omit(accountRef, ['createdAt', 'deletedAt', 'updatedAt'])
}
