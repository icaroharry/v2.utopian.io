export const setProfile = (state, profile) => {
  state.profile = profile
}

export const setProfileDetails = (state, details) => {
  state.profile = { ...state.profile, details: details || {} }
}

export const setProfileArticles = (state, articles) => {
  state.profile = {
    ...state.profile,
    articles: state.profile.articles.concat(articles)
  }
}

export const deleteProfileArticles = (state) => {
  state.profile = {
    ...state.profile,
    articles: []
  }
}

export const setProfileProjects = (state, projects) => {
  state.profile = {
    ...state.profile,
    projects: state.profile.projects.concat(projects)
  }
}

export const deleteProfileProjects = (state) => {
  state.profile = {
    ...state.profile,
    projects: []
  }
}
