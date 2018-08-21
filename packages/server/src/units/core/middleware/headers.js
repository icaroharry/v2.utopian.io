export default (req, resp, next) => {
  console.log(req.headers)
  next()
}