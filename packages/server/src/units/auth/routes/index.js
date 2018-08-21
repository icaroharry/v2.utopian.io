import login from './login'
import github from './github'

export default {
  prefix: '/auth',
  routes: [login, github]
}
