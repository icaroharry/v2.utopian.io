// import cors.
import cors from 'cors'

// export cors, allowing requests.
export default cors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] })
