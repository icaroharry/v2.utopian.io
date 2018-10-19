// imports.

export default [
  {
    path: '/',
    component: () => import('src/layouts/main'),
    children: [
      {path: '', name: 'home', component: () => import('src/pages/index/index'), meta: {weight: 10}},
      {
        path: '@:username',
        component: () => import('src/pages/profile/profile'),
        children: [
          {path: '/', redirect: 'contributions'},
          {path: 'contributions/:category', name: 'profile.contributions', component: () => import('src/pages/profile/contributions/contributions')},
          {path: 'contributions', redirect: 'contributions/all'},
          {path: 'followers', name: 'profile.followers', component: () => import('src/pages/profile/follow/follow'), meta: {type: 'followers'}},
          {path: 'following', name: 'profile.following', component: () => import('src/pages/profile/follow/follow'), meta: {type: 'following'}}
        ]
      }
    ]
  },
  {
    path: '/',
    component: () => import('src/layouts/main'),
    children: [
      {
        path: 'project/create',
        name: 'project.create',
        component: () => import('src/pages/projects/create-edit/create-edit')
      },
      {
        path: 'project/:name/edit',
        name: 'project.edit',
        component: () => import('src/pages/projects/create-edit/create-edit')
      },
      {
        path: 'projects',
        name: 'project.search',
        component: () => import('src/pages/project-search/project-search'),
        meta: {}
      },
      {
        path: 'project/:name',
        component: () => import('src/pages/project/project'),
        children: [
          {path: '/', redirect: 'contributions/all'},
          {path: 'contributions', redirect: 'contributions/all'},
          {path: 'details', name: 'project.details', component: () => import('src/pages/project/details/details')},
          {path: 'contributions/:category', name: 'project.contributions', component: () => import('src/pages/project/contributions/contributions')},
          {path: 'contributors', name: 'project.contributors', component: () => import('src/pages/project/contributors/contributors')},
          {path: 'tasks', name: 'project.tasks', component: () => import('src/pages/project/tasks/tasks')},
          {path: 'updates', name: 'project.updates', component: () => import('src/pages/project/updates/updates')}
        ]
      },
      {
        path: 'contributions',
        name: 'contributions',
        component: () => import('src/pages/contributions/contributions'),
        meta: {weight: 10}
      },
      {
        path: 'posts',
        name: 'posts',
        component: () => import('src/pages/contributions/contributions'),
        meta: {weight: 10, order: 'trending'}
      },
      {
        path: 'posts/:category',
        name: 'posts-category',
        component: () => import('src/pages/contributions/contributions'),
        meta: {weight: 10, order: 'new'}
      },
      {
        path: 'trending/:category',
        name: 'posts.trending',
        component: () => import('src/pages/contributions/contributions'),
        meta: {weight: 10, order: 'trending'}
      },
      {
        path: 'new/:category',
        name: 'posts.new',
        component: () => import('src/pages/contributions/contributions'),
        meta: {weight: 10, order: 'new'}
      },
      {
        path: ':category/:author/:permlink',
        name: 'post',
        component: () => import('src/pages/post/post'),
        meta: {weight: 10, centered: true}
      },
      {
        path: 'create',
        name: 'create',
        component: () => import('src/pages/contributions/create/create'),
        meta: {weight: 10}
      },
      {
        path: 'contributions/:author/:permlink/edit',
        name: 'contributions.edit',
        component: () => import('src/pages/contributions/edit/edit'),
        meta: {weight: 10}
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('src/pages/settings/settings'),
        meta: {weight: 50}
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/login/login')
  },
  {
    path: '/users',
    component: () => import('src/layouts/guest'),
    children: [
      {path: 'create', name: 'users.create', component: () => import('src/pages/users/create/create')}
    ]
  },
  { // Always leave this as last one
    path: '*',
    name: 'not-found',
    component: () => import('src/pages/404/404')
  }
]
