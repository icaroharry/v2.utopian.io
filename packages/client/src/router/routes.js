export default [
  {
    path: '/',
    component: () => import('src/layouts/main'),
    children: [
      {
        path: '', name: 'home', component: () => import('src/pages/index/index')
      },
      {
        path: 'project/create',
        name: 'project.create',
        component: () => import('src/pages/projects/create-edit/create-edit')
      },
      {
        path: 'project/:name/edit',
        name: 'project.edit',
        component: () => import('src/pages/projects/create-edit/create-edit')
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    name: 'not-found',
    component: () => import('src/pages/404/404')
  }
]
