[![Utopian channel on Discord](https://img.shields.io/badge/chat-discord-738bd7.svg)](https://discord.gg/CA9pqES)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Build Status](https://travis-ci.org/utopian-io/v2.utopian.io.svg?branch=develop)](https://travis-ci.org/utopian-io/v2.utopian.io)

# Utopian.io Colony

<p align="center">
  <img src="https://cdn.steemitimages.com/DQmQpCiqJaNconfJ4aCbyDpD3qBMV5qA3KVDRfU2jkcoJvW/utopian-colony-fb.png" />
</p>

Utopian Colony is a platform for open source collaboration, home to all digital professionals with a passion for open source innovation. Utopian Colony gives everyone a voice and a place to contribute, reward and be rewarded.

### Install instructions

The project uses yarn. Refer to its [documentation](https://yarnpkg.com/en/docs/install) to install it.

##### Install lerna

```shell
yarn global add lerna
```

##### Install dependencies of all the packages
This will bootstrap all the projects of the monorepo. If you only want to install a specific project, open the project folder and follow the instructions in the README.md.

```shell
yarn
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


### Testing
If you are new to testing, please check out this [stack overflow answer](https://stackoverflow.com/a/520116) to learn more about what different kinds of tests are for.

#### Unit testing
Unit testing exists to prove that functions do WHAT they are supposed to do, not HOW they do it. It ensures simplicity and coherence with regard to specific "atomic units" within the larger scheme of systemic behaviour. For example, if we are testing a button's extended functionality, we don't care:

- about the way the original button component works (because it has been tested elsewhere)
- if the backend API really is working (use a mock)
- what data is returned (if you need it make a db fixture)
- what translation is used (we mock them out of the tests anyway)
- how the button works internally (because if this functionality is refactored, the tests will break)

So please consider your unit tests to be validations of functionality. This will definitely reduce the amount of tests you will be writing.

#### e2e testing
e2e testing, on the other hand, makes sure that the entire ecosystem works as one organism. This is where you might want to hit real API's, because this is as close as we will get to interaction with the client devices - and mock's won't cut it. However, if you just need to make sure that a logged in user can do something specific, by all means mock the `/me` endpoint.

#### Setting up the test environment
We maintain all peer dependencies in the `/packages/testing` folder. Jest is automatically installed for you, but to run e2e tests, you will need to install and start selenium - which has the hard requirement of at least JVM 8.
```
yarn selenium:install
yarn selenium:start
```

#### Writing tests
Write a spec file and place it in the appropriate test runner folder. For API, this is `/packages/api/test/modules/%modulename%/` and for AUTH & CLIENT, you will put unit tests in `/packages/%package%/test/webdriver/__tests__/`.


#### Running tests
If you are building your tests with the <test> template, you can run jest with the `--watch` mode, so you will automatically see the test run (and hopefully pass). It probably makes more sense just to run the watch mode in the individual repo you are working on, as the reporting within the lerna context is not as granular.

If you are running e2e tests, then make sure you have installed and started your selenium server, and then run the e2e tests.
> Super important! Make sure you have a running dev server, because otherwise no e2e tests!!!

#### Final notes
Please make sure to merge in your tests, because generated files are not automatically added to git. If you have any suggestions for improvements to either the approach or this documentation, please let us know. If you need more information, please consult the readme in the /packages/testing folder.


#### Submitting your Pull Request

When you submit your Pull Request you need to be sure that it contains only the files that you've modified.

Two cases can happen, the easiest one is that you worked on your feature and when you submit your Pull Request no conflict is spotted by GitHub. In this case, just do your commits as usual, push your branch and submit your Pull Request.

The other case is when you need to use some updated code of the develop branch or when you have a conflict. To achieve this you need to rebase your feature's branch onto the develop by doing the following steps.
Be sure to commit all your work first and then 
```
git fetch
git checkout develop
git pull
git checkout my_branch
git reset --soft HEAD~X // where X is the number of commits that you did
```
At this point you might need to stash your changes
```
git stash
```
Then
```
git rebase develop
```
And may be reapply your stash
```
git stash pop
```
```
git commit -m "my commit message"
git push -f
```
This will rewrite the history of your branch and ensure that your Pull Request doesn't contain the files of other merged features.

And yes you lose your commit history. For us, it doesn't matter because your Pull Request will be Squashed and Merged.

#### Troubleshooting
Sometimes things break, and its hard to figure out what is going on: Here are a couple things that will help you to restore to a clean environment, which almost always fixes things:

- clear your site data in the browser console (for both auth and client)
- read the entire stack trace of errors and track it back to a file you recognize
- if you see any kind of warning anywhere, resolve it or escalate to the core team
- you must not be running multiple instances of the api, auth or client packages
- kill all running node processes and start over: `yarn danger:killall`
- increase the memory available to node: 
  `NODE_OPTIONS=--max_old_space_size=4096 quasar dev`
- on Windows: [Have you tried turning it off and on again?](https://www.youtube.com/watch?v=nn2FB1P_Mn8)
- are your critical libraries (node, yarn) up to date?
- is there an open PR that addresses your problem or an issue in the offending node module?
- if your issue is about Quasar, have you asked at the [Quasar Discord channel](https://discord.gg/rmdY9jE)?

If you are still having problems, run the following in the root folder of the repository to reset all repositories:  
```
yarn
lerna clean
lerna link
lerna bootstrap
```

If you can't solve the problem, please reach out on the Discord channel and give a full report, including:
- OS
- Branch
- Browser
- node and yarn versions 
- stacktrace
- description of how to replicate

### License

GPL-3.0 Copyright (c) 2018 Utopian Company SRLs.
