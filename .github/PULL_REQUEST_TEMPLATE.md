### Verify that
Git checklist
- [ ] the branch name follows the git flow naming convention + label + UT reference if applicable (feature/i18n/UT-283)
- [ ] I have rebased my branch to develop before submitting my PR

Front end checklist
- [ ] the design is responsive
- [ ] the code doesn't break Server Side Rendering

API checklist
- [X] the code doesn't break the api endpoints contract (applicable when we're in production and the api is officially open and used by 3rd party app)

Tests and comments checklist
- [ ] JS Standard code style has been verified with ESLint
- [ ] the pull request contains unit tests for new code that passes and has at least 50% coverage
- [ ] functions are prefixed with JSDoc information or the doc has been updated

### My PR doesn't concern a Jira task
Please write a description of what this PR is about before providing the test plan.

---

Please provide a test plan so that the reviewers can see how you tested your work and/or the different acceptance criteria described in the task.

### **Test plan**

_Feature / acceptance criteria tested_

* Step 1
* Step 2
* ...

**Expected result:** You should ...