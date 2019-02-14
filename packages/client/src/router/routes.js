export default (cookies) => ([
  {
    // failsafe
    path: '/',
    redirect: cookies.get('locale') || '/en'
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
        component: () => import('src/pages/projects/create-edit/create-edit'),
        meta: { auth: true }
      },
      {
        path: 'projects/:owner/:slug/edit',
        name: 'projects.edit',
        props: true,
        component: () => import('src/pages/projects/create-edit/create-edit'),
        meta: { auth: true }
      },
      {
        path: 'projects/:owner/:slug',
        name: 'projects.view',
        props: true,
        component: () => import('src/pages/projects/view/view'),
        children: [{
          path: ':tab',
          name: 'projects.view.tab',
          props: true,
          component: () => import('src/pages/projects/view/view')
        }]
      },
      {
        path: 'articles/create',
        name: 'articles.create',
        props: true,
        component: () => import('src/pages/articles/create-edit/create-edit'),
        meta: { auth: true }
      },
      {
        path: 'articles/:author/:slug/edit',
        name: 'articles.edit',
        props: true,
        component: () => import('src/pages/articles/create-edit/create-edit'),
        meta: { auth: true }
      },
      {
        path: 'articles/:author/:slug',
        name: 'articles.view',
        props: true,
        component: () => import('src/pages/articles/view/view')
      },
      {
        path: 'bounties/create',
        name: 'bounties.create',
        props: true,
        component: () => import('src/pages/bounties/create-edit/create-edit'),
        meta: { auth: true }
      },
      {
        path: 'bounties/:author/:slug/edit',
        name: 'bounties.edit',
        props: true,
        component: () => import('src/pages/bounties/create-edit/create-edit'),
        meta: { auth: true }
      },
      {
        path: 'bounties/:author/:slug',
        name: 'bounties.view',
        props: true,
        component: () => import('src/pages/bounties/view/view')
      },
      {
        path: 'profile',
        name: 'users.profile.edit',
        props: true,
        component: () => import('src/pages/users/profile/edit/profile-edit'),
        meta: { auth: true },
        children: [{
          path: ':tab',
          name: 'users.profile.edit.tab',
          props: true,
          component: () => import('src/pages/users/profile/edit/profile-edit')
        }]
      },
      {
        path: '@:username',
        name: 'users.profile.view',
        props: true,
        component: () => import('src/pages/users/profile/view/profile-view'),
        meta: { fullWidth: true },
        children: [{
          path: ':tab',
          name: 'users.profile.view.tab',
          props: true,
          component: () => import('src/pages/users/profile/view/profile-view'),
          meta: { fullWidth: true }
        }]
      },
      {
        path: 'search',
        name: 'search',
        props: true,
        component: () => import('src/pages/search/articles/search-articles'),
        children: [{
          path: 'articles',
          name: 'search.articles',
          props: true,
          component: () => import('src/pages/search/articles/search-articles')
        }]
      }
    ]
  },
  { // Always leave this as last one
    path: '/:locale/*',
    name: 'not-found',
    props: true,
    component: () => import('src/pages/404/404')
  }
])
