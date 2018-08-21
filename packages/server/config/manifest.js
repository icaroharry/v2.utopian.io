module.exports = {
  server: {
    port: process.env.PORT || 5000,
    routes: {
      validate: {
        failAction: (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            throw h.response(`Invalid request payload input`).code(400)
          } else {
            console.error(err)
            throw err
          }
        }
      }
    }
  },
  register: {
    plugins: [
      {
        plugin: 'good',
        options: {
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
      { plugin: './routes' }
    ]
  }
}
