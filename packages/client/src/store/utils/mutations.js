export const pushLocalStorageValues = (state, values) => {
  state.localStorageData = state.localStorageData.concat(values)
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
