import API from 'src/plugins/api'

export const isUsernameAvailable = async (context, username) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/user/${username}/available`
  })

  return payload.available
}

const partialCleaner = (val) => val
  .toLowerCase()
  .replace(/[^\w-\\.]/g, '')

export const searchUsers = async (context, { term, count }) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/users/${partialCleaner(term)}/${count}`
  })
