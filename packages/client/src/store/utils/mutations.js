export const pushLocalStorageValues = (state, values) => {
  state.localStorageData = state.localStorageData.concat(values)
}

export const setCategories = (state, categories) => {
  state.categories = categories || []
}

export const setLanguages = (state, languages) => {
  state.languages = languages || []
}

export const clearLocalStorageValues = (state) => {
  state.localStorageData = []
}

export const setAppError = (state, appError) => {
  state.appError = appError
}

export const setAppSuccess = (state, appSuccess) => {
  state.appSuccess = appSuccess
}

export const setSSRIp = (state, ssrIp) => {
  state.ssrIp = ssrIp
}
