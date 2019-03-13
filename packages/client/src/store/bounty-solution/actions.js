import API from 'src/plugins/api'

export const saveBountySolution = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/bountysolutions',
    data
  })

export const updateBountySolution = async (context, solution) => {
  const { _id, ...data } = solution
  return API.call({
    context,
    method: 'post',
    url: `/v1/bountysolutions/${_id}`,
    data
  })
}

export const fetchBountySolutionForEdit = async (context, id) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/bountysolutions/${id}/edit`
  })

export const updateBlockchainData = async (context, { id, blockchain, data }) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/bountysolutions/blockchains/${blockchain}/${id}`,
    data
  })

export const fetchBountySolution = async (context, id) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/bountysolutions/${id}`
  })
  context.commit('setSolution', payload)
  return payload
}
