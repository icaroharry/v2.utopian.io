import saveContribution from './saveContribution'
import getContributions from './getContributions'
import editContributions from './editContributions'

export default {
  prefix: '/contributions',
  routes: [saveContribution, getContributions, editContributions]
}
