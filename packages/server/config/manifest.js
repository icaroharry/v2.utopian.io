'use strict';

module.exports = {
  server: {
    port: process.env.PORT || 5000,
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
      { plugin: 'inert'},
      { plugin: 'vision' },
      {
        plugin: 'hapi-swagger',
        options: {
          info: {
            title: 'Utopian API Documentation'
          }
        }
      },
      { plugin: './routes'}
    ]
  }
};
