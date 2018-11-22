import API from 'src/plugins/api'

export const transferToLocalStorage = ({ state, commit }) => {
  state.localStorageData.forEach(obj => {
    localStorage.setItem(obj.key, obj.value)
  })
  commit('clearLocalStorageValues')
}

export const getLanguages = async (context) => {
  if (context.rootState.utils.languages.length === 0) {
    const payload = await API.call({
      context,
      method: 'get',
      url: '/v1/languages'
    })
    context.commit('setLanguages', payload)
  }
}

export const clearAppError = ({ commit }) => commit('setAppError', null)
export const setAppError = ({ commit }, value) => commit('setAppError', value)
export const clearAppSuccess = ({ commit }) => commit('setAppSuccess', null)
export const setAppSuccess = ({ commit }, value) => commit('setAppSuccess', value)
