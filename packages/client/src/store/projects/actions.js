import API from 'src/services/api'

export const getFeaturedProjects = async (context) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: '/v1/projects/featured'
  })
  context.commit('setFeaturedProjects', payload)
}
