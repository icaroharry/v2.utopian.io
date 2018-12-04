export const transferToLocalStorage = ({ state, commit }) => {
  state.localStorageData.forEach(obj => {
    localStorage.setItem(obj.key, obj.value)
  })
  commit('clearLocalStorageValues')
}

export const clearAppError = ({ commit }) => commit('setAppError', null)
export const setAppError = ({ commit }, value) => commit('setAppError', value)
export const clearAppSuccess = ({ commit }) => commit('setAppSuccess', null)
export const setAppSuccess = ({ commit }, value) => commit('setAppSuccess', value)
