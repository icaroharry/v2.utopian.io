export const setFeaturedProjects = (state, featuredProjects) => {
  state.featuredProjects = featuredProjects || []
}

export const setProject = (state, project) => {
  state.project = project || {}
}

export const setProjectUpdates = (state, updates) => {
  state.project = {
    ...state.project,
    updates: state.project.updates.concat(updates)
  }
}

export const deleteProjectUpdates = (state) => {
  state.project = {
    ...state.project,
    updates: []
  }
}
