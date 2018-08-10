
const https = require('https')
const NodeGit = require("nodegit");

const options = {
  headers: { 'User-Agent': 'icaroharry' },
  hostname: 'api.github.com',
  path: '/repos/utopian-io/v2.utopian.io/pulls'
}

https.get(options, (resp) => {
  let data = ''
  resp.on('data', (res) => {
    data += res
  })

  resp.on('end', () => {
    
    // git url: JSON.parse(data)[2].head.repo.git_url
    console.log(JSON.parse(data)[2].head.repo.git_url)
    NodeGit.Repository.open('.').then(function (repo) {
      console.log(repo)
      // Inside of this function we have an open repo
    });
  })

}).on("error", (err) => {
  console.log("Error: " + err.message)
})