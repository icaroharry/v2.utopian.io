# Utopian.io v2

<p align="center">
  <img src="https://cdn.steemitimages.com/DQmVV3aEvdcwPR6RuJebHWLmibTBtwsLQoc3AnD7RQFE9DA/utopian-post-banner.png" />
</p>

This repository is the home of the new Utopian.io frontend. Vue.JS & Quasar Framework based.


### Contributions.

> **This is a early-stage project, meaning changes happens fast. Before putting work contributing, be sure to open a
proper issue to discuss your intention and receive proper advice.**

### Project Details.

Some information about this project.

#### Architecture.

So far, the frontend is completely client-side only, meaning no server is required to run the application. Anything that
can be client-side, without server dependency, should be.

#### Coding Standards.

- Keep components minimal.
- Security is the primary concern.
- Javascript Standard Style (enforced by ESLint)
- PUG (ex-Jade) templates.

#### Security.

The application, does not store credentials on server. Instead, SteemConnect implicit grant is used and the token lives
on client-side only, and the client side is the solely responsible for broadcasting operations.

Any sensitive data stored on browser is strongly encrypted with `AES-256-GCM` though WebCrypto API.

A secret encryption key is handled by the browser, in a non-exportable manner, meaning the local encryption keys (which
are safely random) are not visible, not even for the application.

It means a browser security breach would be required to compromise the data.

Also, care is taken on the actual token handling, SteemConnect and any other broadcasting drivers are deep cloned before
operations, and the cloned instances are destroyed after usage (avoid having tokens on memory at any time, every action
requires decryption-usage-zeromem).

PIN codes for PBKDF2 derivations are a secondary goal.

@TODO improve encryption process documentation.

### Install

Be sure to have a `.env` file on the project root folder. The same can be created using .env.example as base.

##### Install dependencies.

```shell
npm install
```

##### Run Development Server

```shell
npm run dev
```

##### Production Builds

```shell
npm run build
```
