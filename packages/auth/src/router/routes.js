
const routes = [
  {
    path: '/',
    name: 'home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/login')
  },
  {
    path: '/signup/utopian',
    name: 'signup.utopian',
    component: () => import('src/pages/signup/utopian')
  },
  { // Always leave this as last one
    path: '*',
    name: 'not-found',
    component: () => import('src/pages/404')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('src/pages/404')
  })
}

export default routes
