export default [
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
        path: '/:locale',
        name: 'home',
        props: true,
        component: () => import('src/pages/index/index')
      },
      {
        path: 'projects/create',
        name: 'projects.create',
        props: true,
        component: () => import('src/pages/projects/create-edit/create-edit')
      },
      {
        path: 'projects/:owner/:slug/edit',
        name: 'projects.edit',
        props: true,
        component: () => import('src/pages/projects/create-edit/create-edit')
      },
      {
        path: 'articles/create',
        name: 'articles.create',
        props: true,
        component: () => import('src/pages/articles/create-edit/create-edit')
      },
      {
        path: 'articles/:author/:slug/edit',
        name: 'articles.edit',
        props: true,
        component: () => import('src/pages/articles/create-edit/create-edit')
      },
      {
        path: 'profile',
        name: 'users.profile',
        props: true,
        component: () => import('src/pages/users/profile/profile')
      },
      {
        path: 'i18n',
        name: 'i18n.test',
        props: true,
        component: () => import('src/pages/tests/i18n')
      },
      {
        path: '/:locale/QEditor',
        name: 'QEditor',
        props: true,
        component: () => import('@/pages/tests/QEditor.vue')
      }
    ]
  },
  { // Always leave this as last one
    path: '/:locale/*',
    name: 'not-found',
    props: true,
    component: () => import('src/pages/404/404')
  }
]
