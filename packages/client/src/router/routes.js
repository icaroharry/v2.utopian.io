export default [
  {
    path: '/',
    component: () => import('src/layouts/main'),
    props: true,
    children: [
      {
        path: '/:locale',
        name: 'home',
        props: true,
        component: () => import('src/pages/index/index')
      },
      {
        path: '/:locale/project/create',
        name: 'project.create',
        props: true,
        component: () => import('src/pages/projects/create-edit/create-edit')
      },
      {
        path: '/:locale/project/:name/edit',
        name: 'project.edit',
        props: true,
        component: () => import('src/pages/projects/create-edit/create-edit')
      },
      {
        path: '/:locale/project/search',
        name: 'project.search',
        props: true,
        component: () => import('src/pages/projects/create-edit/create-edit')
      },
      {
        path: '/:locale/i18n',
        name: 'i18n.test',
        props: true,
        component: () => import('src/pages/tests/i18n')
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
