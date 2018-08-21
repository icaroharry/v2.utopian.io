import createProject from './createProject'
import listProjects from './listProjects'
import editProject from './editProject'
import getContributors from './getContributors'

export default {
  prefix: '/projects',
  routes: [createProject, listProjects, editProject, getContributors]
}
