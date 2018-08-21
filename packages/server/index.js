const Glue = require('glue');

const manifest = require('./config/manifest');

const startServer = async () => {
  const server = await Glue.compose(
    manifest,
    {
      relativeTo: __dirname
    }
  );
  await server.start();
};

startServer();