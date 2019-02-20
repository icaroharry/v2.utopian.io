export const setBounty = (state, bounty) => {
  state.bounty = bounty || []
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
}

export const updateProposal = (state, upToDateProposal) => {
  const idx = state.proposals.findIndex((proposal) => proposal._id === upToDateProposal._id)
  state.proposals = [
    ...state.proposals.slice(0, idx),
    upToDateProposal,
    ...state.proposals.slice(idx + 1)
  ]
}

export const addNewActivity = (state, activity) => {
  state.bounty.activity.push(activity)
}
