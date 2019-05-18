module.exports = function (source, map) {
  this.callback(
    null,
    `${source.replace(/\n{2,}/, '')}`,
    map
  )
}
