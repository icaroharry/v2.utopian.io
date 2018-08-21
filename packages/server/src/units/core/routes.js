// router defination.
export default {
  prefix: '/',
  routes: [{
    path: '/ping',
    methods: ['post'],
    handler: (data, context) => {
      console.log('pong')
      return Promise.resolve({ pong: true })
    }
  }]
}
