import API from 'src/plugins/api'

export const saveBounty = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/bounty',
    data
  })

export const updateBounty = async (context, article) => {
  const { _id, ...data } = article
  return API.call({
    context,
    method: 'post',
    url: `/v1/bounty/${_id}`,
    data
  })
}

export const fetchBountyForEdit = async (context, { author, slug }) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/bounty/${author}/${slug}/edit`
  })

export const fetchBounty = async (context, { author, slug }) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/bounty/${author}/${slug}`
  })
  context.commit('setBounty', payload)
  return payload
}

export const updateBlockchainData = async (context, { id, blockchain, data }) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/bounty/blockchains/${blockchain}/${id}`,
    data
  })
