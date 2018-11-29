[![Utopian channel on Discord](https://img.shields.io/badge/chat-discord-738bd7.svg)](https://discord.gg/CA9pqES)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Greenkeeper badge](https://badges.greenkeeper.io/utopian-io/v2.utopian.io.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/utopian-io/v2.utopian.io.svg?branch=develop)](https://travis-ci.org/utopian-io/v2.utopian.io)

# Utopian.io v2

<p align="center">
  <img src="https://cdn.steemitimages.com/DQmVV3aEvdcwPR6RuJebHWLmibTBtwsLQoc3AnD7RQFE9DA/utopian-post-banner.png" />
</p>

This repository is the home of the new Utopian.io.

### Install instructions

The project uses yarn. Refer to its [documentation](https://yarnpkg.com/en/docs/install) to install it.

##### Install lerna

```shell
yarn global add lerna
```

##### Install dependencies of all the packages
This will bootstrap all the projects of the monorepo. If you only want to install a specific project, open the project folder and follow the instructions in the README.md.

```shell
lerna link
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

If you want to help us build this great project, these are the steps you will have to take to get started.

Please open the [issues page](https://github.com/utopian-io/v2.utopian.io/issues). 

You can work on any issue of the [project board](https://github.com/orgs/utopian-io/projects/4) that is prefixed with [UT-*] and is in the **To do column** and is **not assigned**.

All issues have been assigned a difficulty score from 1 to 5. A score of 1 is an easy task that can be completed by a beginner. 5 is for experienced developers who have a good understanding of the project and the technologies we are using.

You've picked one? Great.

Read the description carefully and check the UML and design.

Are you feeling up to the task? DM @gregory[mod] on the [utopian discord](https://discord.gg/CA9pqES) with the following message:
> Hi,
> I would like to start working on the task _GITHUB_ISSUE_URL_.
>
> A little bit about me: _a short description of your experience as a developer_
> My GitHub repo: _link to your repo_

You will then join a dedicated discord channel and meet your fellow collaborators. **Please read the pinned messages of the channel before doing anything else.**

Let's get to work!

### Submitting your Pull Request

When you submit your Pull Request you need to be sure that it contains only the files that you've modified. You also need to resolve any conflicts with the develop branch.
To achieve this you need to rebase your feature's branch by doing the following
```
git fetch
git checkout develop
git pull
git checkout my_branch
git reset --soft HEAD~X // where X is the number of commits that you did
git rebase develop
git commit -m "my commit message"
git push -f
```
This will rewrite the history of your branch and ensure that your Pull Request doesn't contain the files of other merged features.
And yes you lose your commit history. For us, it doesn't matter because your Pull Request will be Squashed and Merged.

### License

GPL-3.0 Copyright (c) 2018 Utopian Company SRLs.