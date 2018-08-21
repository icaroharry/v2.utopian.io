// imports
import logger from 'morgan'

// detect node env.
const env = process.env.NODE_ENV || 'development'

// export logger middleware.
export default logger(env === 'development' ? 'dev' : 'prod')
