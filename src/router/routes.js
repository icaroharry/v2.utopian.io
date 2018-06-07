// imports.

export default [
  {
    path: '/',
    component: () => import('src/layouts/main'),
    children: [
      {path: '', name: 'home', component: () => import('src/pages/index/index'), meta: {weight: 10}},
      {path: 'contributions', name: 'contributions', component: () => import('src/pages/contributions/contributions'), meta: {weight: 10}},
      {path: 'posts', name: 'posts', component: () => import('src/pages/index/index'), meta: {weight: 10, order: 'trending'}},
      {
        path: 'posts/:category',
        name: 'posts-category',
        component: () => import('src/pages/index/index'),
        meta: {weight: 10, order: 'new'}
      },
      {
        path: 'trending/:category',
        name: 'posts.trending',
        component: () => import('src/pages/index/index'),
        meta: {weight: 10, order: 'trending'}
      },
      {
        path: 'new/:category',
        name: 'posts.new',
        component: () => import('src/pages/index/index'),
        meta: {weight: 10, order: 'new'}
      },
      {
        path: ':category/:author/:permlink',
        name: 'post',
        component: () => import('src/pages/post/post'),
        meta: {weight: 10}
      },
      {path: 'create', name: 'create', component: () => import('src/pages/create/create'), meta: {weight: 10, large: true}},
      {path: 'settings', name: 'settings', component: () => import('src/pages/settings/settings'), meta: {weight: 50}}
    ]
  },
  {
    path: '/auth',
    component: () => import('src/layouts/guest'),
    children: [
      {path: 'login', name: 'auth.login', component: () => import('src/pages/auth/login'), meta: {weight: 10}},
      {path: 'logout', name: 'auth.logout', component: () => import('src/pages/auth/logout'), meta: {weight: 10}},
      {path: 'callback', name: 'auth.callback', component: () => import('src/pages/auth/callback'), meta: {weight: 10}}
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('src/pages/404/404')
  }
]
