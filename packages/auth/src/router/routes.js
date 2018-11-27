const routes = [
  {
    // failsafe
    path: '/',
    redirect: '/en'
  },
  {
    path: '/:locale',
    component: () => import('src/layouts/main'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('src/pages/login')
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('src/pages/signup'),
        meta: { auth: true }
      },
      {
        path: 'steem/connect',
        name: 'steem.connect',
        component: () => import('src/pages/steem/connect'),
        meta: { auth: true }
      },
      {
        path: 'steem/create',
        name: 'steem.create',
        component: () => import('src/pages/steem/create'),
        meta: { auth: true }
      }
    ]
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
    path: '/:locale/*',
    component: () => import('src/pages/404')
  })
}

export default routes
