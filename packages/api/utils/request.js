const getClientIp = (request) => {
  const xFF = request.headers['x-forwarded-for']
  return xFF ? xFF.split(',')[0] : request.info.remoteAddress
}

module.exports = {
  getClientIp
}
