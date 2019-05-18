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

export const saveProposal = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: '/v1/bounty/proposal',
    data
  })

  context.commit('addNewProposal', payload.proposal)
  if (payload.activity) {
    context.commit('addNewActivity', payload.activity)
  }
}

export const updateProposal = async (context, { body, id }) => {
  const proposal = await API.call({
    context,
    method: 'post',
    url: `/v1/bounty/proposal/${id}`,
    data: {
      body
    }
  })

  context.commit('updateProposal', proposal)
}

export const deleteProposal = async (context, id) => {
  const deleted = await API.call({
    context,
    method: 'post',
    url: `/v1/bounty/proposal/${id}/delete`
  })

  if (deleted) {
    context.commit('deleteProposal', id)
  }
}

export const fetchProposals = async (context, { objId, skip = 0, limit = 10 }) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/bounty/${objId}/proposals?skip=${skip}&limit=${limit}`
  })

  context.commit('setProposals', payload)
}

export const fetchSolutions = async (context, id) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/bounty/${id}/solutions`
  })

  context.commit('setSolutions', payload)
}

export const searchSkills = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/bounty/searchSkills',
    data
  })

export const getEscrowAccounts = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/bounty/escrowaccounts',
    data
  })

export const assignUser = async (context, data) => {
  const { activity, ...payload } = await API.call({
    context,
    method: 'post',
    url: '/v1/bounty/assignuser',
    data
  })
  context.commit('assignUser', payload)
  context.commit('addNewActivity', activity)
  return true
}

export const acceptBounty = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: '/v1/bounty/acceptbounty',
    data
  })
  if (!payload) return false
  context.commit('addNewActivity', payload.activity)
  context.commit('updateEscrowStatus', payload.escrowStatus)
  return true
}

export const cancelBounty = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: '/v1/bounty/cancelbounty',
    data
  })
  if (!payload) return false
  context.commit('addNewActivity', payload.activity)
  context.commit('updateEscrowStatus', payload.escrowStatus)
  context.commit('removeAssignee', payload.status)
  return true
}

export const acceptSolution = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: '/v1/bounty/acceptsolution',
    data
  })
  if (!payload) return false
  context.commit('setBountyAndEscrowStatus', payload)
  context.commit('bountySolution/setStatus', payload.solutionStatus, { root: true })
  return true
}
