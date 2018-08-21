# Utopian v2 - API

<p align="center">
  <img src="https://cdn.steemitimages.com/DQmVV3aEvdcwPR6RuJebHWLmibTBtwsLQoc3AnD7RQFE9DA/utopian-post-banner.png" />
</p>

### Quick instructions:

1. Copy `.env.example` to `.env` and adjust variable values.
2. Generate **Firebase admin credentials file** and place on the project root as **`service-account.json`**.
3. [deployment only] Create **`.firebaserc`** on the project root folder, changing the Firebase project name as on the following
example:

```js
{
  "projects": {
    "default": "utopian-io"
  }
}
```

### Building:

> Build for server usage (HTTPS server outside firebase).

```
npm run build:server
```

> Build for firebase deployment.

```
npm run build:firebase
```

### Development

> Run development server:

```
npm run dev
```

### Deployment - Firebase.

> For firebase deployments, the firebase sdk must be installed globally:

```
npm install -g firebase-tools
```

> Then, login with valid credentials

```
firebase login
```

> And finally, deploy.

```
firebase deploy --only functions
```

### Deployment - Express.

```
npm run start
```

// OR

```
node ./bin/www
```