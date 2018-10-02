[![Utopian channel on Discord](https://img.shields.io/badge/chat-discord-738bd7.svg)](https://discord.gg/CA9pqES)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

# Utopian.io v2

<p align="center">
  <img src="https://cdn.steemitimages.com/DQmVV3aEvdcwPR6RuJebHWLmibTBtwsLQoc3AnD7RQFE9DA/utopian-post-banner.png" />
</p>

This repository is the home of the new Utopian.io.

### Install instructions

The project uses yarn. Refer to its [documentation](https://yarnpkg.com/en/docs/install) to install it.

##### Install lerna

```shell
npm install -g lerna
```

##### Install dependencies of all the packages
This will bootstrap all the projects of the monorepo. If you only want to install a specific project, open the project folder and follow the instructions in the README.md.

```shell
lerna bootstrap
```

### Setup the different projects
Read the different projects' READMEs to see how to set them up.

### Start developing
This will start the frontend and backend projects .
```shell
yarn run dev
```

### Contributions

Refer to the contribution section of each project.