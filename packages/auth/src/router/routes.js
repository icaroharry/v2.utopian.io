export default (cookies) => ([
  {
    // failsafe
    path: '/',
    redirect: cookies.get('locale') || 'en'
  },
  {
    path: '/:locale',
    component: () => import('src/layouts/main'),
    children: [
      {
        path: '/:locale',
        name: 'login.default',
        props: true,
        component: () => import('src/pages/default')
      },
      {
        path: 'login',
        name: 'login',
        props: true,
        component: () => import('src/pages/login')
      },
      {
        path: 'signup',
        name: 'signup',
        props: true,
        component: () => import('src/pages/signup'),
        meta: { auth: true }
      },
      {
        path: 'steem/connect',
        name: 'steem.connect',
        props: true,
        component: () => import('src/pages/steem/connect'),
        meta: { auth: true }
      },
      {
        path: 'steem/create',
        name: 'steem.create',
        props: true,
        component: () => import('src/pages/steem/create'),
        meta: { auth: true }
      }
    ]
  },
  { // Always leave this as last one
    path: '/:locale/*',
    name: 'not-found',
    props: true,
    component: () => import('src/pages/404')
  }
])
