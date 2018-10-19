# Utopian.io Backend v2
<p align="center">
  <img src="https://cdn.steemitimages.com/DQmVV3aEvdcwPR6RuJebHWLmibTBtwsLQoc3AnD7RQFE9DA/utopian-post-banner.png" />
</p>

This repository is the home of the new Utopian.io backend. [Hapi JS](https://hapijs.com/) based.

### Install

##### 1. Install dependencies.
You can skip this if you've bootstrapped the project with lerna  
```shell
yarn
```

##### 2. Environment
If you are part of the Utopian dev team, request the .env file and go to step 8. Otherwise, copy/rename the .env.example to the .env file and follow the next steps.

##### 3. Github OAuth App
If you've already created the app, simply add the missing environment variables.

Utopian uses GitHub accounts to log users in. Since we can't publish the OAuth Dev App Secret, you will need to create your own.
Create the OAuth app [here](https://github.com/settings/applications/new) and fill the form with the following values: 
* **Application name:** _My utopian oauth app_
* **Homepage URL:** _http://localhost:8080_
* **Application description:** _My utopian oauth app_
* **Authorization callback URL:** _http://localhost:8080_

When you click on the login button, you'll be redirected to your OAuth app. After authorizing this app, you'll be redirected to the dev website on localhost. 

GitHub gives you a **Client ID** and a **Client Secret**. Set the client id and secret in the .env file.

```
GITHUB_CLIENT_ID=CLIENT_ID
GITHUB_CLIENT_SECRET=CLIENT_SECRET
```

##### 4. MongoDB database
Use of Steem is not mandatory. That's why we have our own database. We are using [mongodb](https://www.mongodb.com/). The easiest way to setup your development environment is to create a free database with a provider, such as [mLab](https://mlab.com/). Follow the instructions and add the mongo database url in the .env file.

```
MONGODB_URI=mongodb://...
```

###### 5. JWT Secret
Authentication in Utopian is token based. You just have to [generate a string](https://strongpasswordgenerator.com/). For development purposes any length will do.
Add the generated secret to the .env file.

```
JWT_SECRET=mySecReT
```

##### 6. SteemConnect App
If you've already created the app, simply add the missing environment variables.


Utopian offers the ability to interact with the [STEEM Blockchain](https://steem.io/) using [SteemConnect](https://steemconnect.com/). Much like in GitHub, we can't provide the client secret. You'll need your own app.
The creation of a SteemConnect app costs 3 Steem (Oct 2018) but I'm sure your first contribution will cover the cost!

To create a SteemConnect app, log in with your Steem account and go [there](https://steemconnect.com/apps/create).
You can learn more about SteemConnect and how to use it by reading this [article](https://steemit.com/steemconnect/@noisy/how-to-configure-steemconnect-v2-and-use-it-with-your-application-how-it-works-and-how-it-is-different-from-v1). 

Once you've created your app, fill the client id and secret in the .env file

```
STEEMCONNECT_CLIENT_ID=my-utopian-app
STEEMCONNECT_CLIENT_SECRET=my-utopian-app-secret
```

##### 7. Encryption key
This key is used to cipher the access, and refresh tokens provided by SteemConnect. The tokens are stored on the user's device. Any blockchain interaction happens on the server.
We are using the algorithm _aes-256-cbc_. Generate a 64 characters string and add it to the .env file.

```
ENCRYPTION_KEY=XXX
```

##### 8. Backend
Refer to the [frontend documentation](https://github.com/utopian-io/v2.utopian.io/tree/develop/packages/client/README.md) to finish setting up the project.

### Development
In the root folder run
```shell
yarn run dev
```
This will start the Quasar app on port 8080 and the backend server on port 5000. Please install the frontend before doing so.

Do you need to populate the database? Check the [fixtures in the test folder](https://github.com/utopian-io/v2.utopian.io/tree/develop/packages/server/test/fixtures)

### Tests
Duplicate your .env and name it .env.test

Create a separate mongo database and change the _MONGODB_URI_. We recommend doing so because the database is automatically populated at start, and then dropped once the tests are done!

Run the tests:
```shell
yarn run test
``` 

### Production
There is nothing to build. You just have to start the app
```shell
node index.js
```
We recommend using [pm2](http://pm2.keymetrics.io/)

Or use [Docker](https://www.docker.com/)!

### Contributions
Please refer to the root [README.md](https://github.com/utopian-io/v2.utopian.io/blob/develop/README.md)

### License

GPL-3.0 Copyright (c) 2018 Utopian Company SRLs.