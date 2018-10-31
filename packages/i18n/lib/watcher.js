function updateI18n () {
  this.startTime = Date.now()
  this.prevTimestamps = {}
}

updateI18n.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    const changedFiles = Object.keys(compilation.fileTimestamps).filter(function (watchfile) { // eslint-disable-line no-unused-vars
      return (this.prevTimestamps[watchfile] || this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity)
    }.bind(this))

    this.prevTimestamps = compilation.fileTimestamps
    callback()
  }.bind(this))
}

module.exports = updateI18n
