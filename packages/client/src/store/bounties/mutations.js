export const setBounty = (state, bounty) => {
  state.bounty = bounty || {}
}

export const setProposals = (state, { proposals, skip, limit, total }) => {
  state.proposals = state.proposals.concat(proposals) || []
  state.skip = skip
  state.limit = limit
  if (total !== -1) {
    state.total = total
  }
}

export const addNewProposal = (state, newProposal) => {
  state.proposals.push(newProposal)
  state.total += 1
  state.bounty.userProposal = true
}

export const clearProposals = (state) => {
  state.proposals = []
  state.skip = 0
  state.limit = 10
  state.total = 0
}

export const deleteProposal = (state, id) => {
  const idx = state.proposals.findIndex((proposal) => proposal._id === id)
  state.proposals.splice(idx, 1)
  state.total -= 1
  state.bounty.userProposal = false
}

export const updateProposal = (state, upToDateProposal) => {
  const idx = state.proposals.findIndex((proposal) => proposal._id === upToDateProposal._id)
  state.proposals = [
    ...state.proposals.slice(0, idx),
    upToDateProposal,
    ...state.proposals.slice(idx + 1)
  ]
}

export const setSolutions = (state, solutions) => {
  state.solutions = solutions || []
}

export const clearSolutions = (state) => {
  state.solutions = []
}

export const addNewActivity = (state, activity) => {
  state.bounty.activity.push(activity)
}

export const assignUser = (state, data) => {
  state.bounty.status = data.status
  state.bounty.assignee = data.assignee
  state.bounty.escrow = data.escrow
}

export const updateEscrowStatus = (state, status) => {
  state.bounty.escrow.status = status
}

export const removeAssignee = (state, status) => {
  state.bounty.status = status
  state.bounty.assignee = null
}

export const setBountyAndEscrowStatus = (state, { bountyStatus, escrowStatus }) => {
  state.bounty.status = bountyStatus
  state.bounty.escrow.status = escrowStatus
}
