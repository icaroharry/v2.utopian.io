# Utopian.io Frontend v2
<p align="center">
  <img src="https://cdn.steemitimages.com/DQmVV3aEvdcwPR6RuJebHWLmibTBtwsLQoc3AnD7RQFE9DA/utopian-post-banner.png" />
</p>

This repository is the home of the new Utopian.io frontend. [Vue.JS](https://vuejs.org/) & [Quasar Framework](https://quasar-framework.org/) based.

### Install

##### 1. Install dependencies
You can skip this if you've bootstrapped the project with lerna  
```shell
yarn
```

##### 2. Environment
If you are part of the Utopian dev team, request the .env file and go to step 5. Otherwise copy/rename the .env.example to the .env file and follow the next steps.

##### 3. Github OAuth App
If you've already created the app, simply add the missing environment variables.

Utopian uses GitHub accounts to log users in. Since we can't publish the OAuth Dev App Secret, you will need to create your own.
Create the OAuth app [here](https://github.com/settings/applications/new) and fill the form with the following values: 
* **Application name:** _My utopian oauth app_
* **Homepage URL:** _http://localhost:8080_
* **Application description:** _My utopian oauth app_
* **Authorization callback URL:** _http://localhost:8080_

When you click on the login button, you'll be redirected to your OAuth app. After authorizing this app, you'll be redirected to the dev website on localhost. 

GitHub gives you a **Client ID** and a **Client Secret**. Set the client id in the .env file. The client secret is used in the server package.

```
GITHUB_CLIENT_ID='"CLIENT_ID"'
```

##### 4. SteemConnect App
If you've already created the app, simply add the missing environment variables.

Utopian offers the ability to interact with the [STEEM Blockchain](https://steem.io/) using [SteemConnect](https://steemconnect.com/). Much like in GitHub, we can't provide the client secret. You'll need your own app.
The creation of a SteemConnect app costs 3 Steem (Oct 2018) but I'm sure your first contribution will cover the cost!

To create a SteemConnect app, log in with your Steem account and go [there](https://steemconnect.com/apps/create).
You can learn more about SteemConnect and how to use it by reading this [article](https://steemit.com/steemconnect/@noisy/how-to-configure-steemconnect-v2-and-use-it-with-your-application-how-it-works-and-how-it-is-different-from-v1). 

Once you've created your app, fill the client id in the .env file. The client secret will be needed for the server package.

```
STEEMCONNECT_CLIENT_ID='"my-utopian-app"'
```

##### 5. Backend
Refer to the [backend documentation](https://github.com/utopian-io/v2.utopian.io/tree/develop/packages/server/README.md) to finish setting up the project

### Development
In the root folder, run
```shell
yarn run dev
```
This will start the Quasar app on port 8080 and the backend server on port 5000. Please install the backend server before.

### Tests
Coming soon

### Production

##### Build
To build the project for production, run the command below. This will compile the Quasar app in the dist folder.

```shell
yarn run build
```
##### Deploy
Simply run

```shell
node ./dist/ssr-mat/index.js
```
We recommend using [pm2](http://pm2.keymetrics.io/)

Or use [Docker](https://www.docker.com/)!

### Contributions
Please refer to the root [README.md](https://github.com/utopian-io/v2.utopian.io/blob/develop/README.md)

### License

GPL-3.0 Copyright (c) 2018 Utopian Company SRLs.
