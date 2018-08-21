// custom error handler.
const errorHandler = function (err, req, res, next) {
  // detect node env.
  const env = process.env.NODE_ENV || 'development'

  // set locals, only providing error in development
  res.locals.message = err.message

  // hide errors when not on development.
  res.locals.error = env === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  // send the error response.
  res.render('error')
}

// default export.
export default errorHandler
