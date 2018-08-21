// import factory server
import factoryServer from '../../support/http/factory-server'

// import core unit.
import { middleware } from '../core'

// import route definitions
import routeDefinitions from './route-definitions'

// create http kernel
const httpKernel = factoryServer(middleware, routeDefinitions)

// default router export.
export default httpKernel
