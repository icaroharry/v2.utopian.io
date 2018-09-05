module.exports = {
  server: {
    port: process.env.PORT || 5000,
    routes: {
      validate: {
        failAction: (request, h, err) => {
          return err
        }
      }
    }
  },
  register: {
    plugins: [
      {
        plugin: 'good',
        options: {
          ops: {
            interval: 300000
          },
          reporters: {
            console: [{
              module: 'good-console'
            }, 'stdout']
          }
        }
      },
      { plugin: 'inert' },
      { plugin: 'vision' },
      {
        plugin: 'hapi-swagger',
        options: {
          info: {
            title: 'Utopian API Documentation'
          }
        }
      },
      { plugin: './config/plugins/jwt-auth' },
      { plugin: './config/plugins/routes' }
    ]
  }
}
