import { forEach } from 'lodash'
import { registerRouterDefinition } from './router'

/**
 * registry routes on httpKernel
 * @method registryRoutes
 * @param  {Router}             httpKernel
 * @param  {Array<Object>}      definitions
 * @return {Router}
 */
const registryRoutes = (httpKernel, definitions) => {
  forEach(definitions, definition => {
    registerRouterDefinition(httpKernel, definition)
  })

  return httpKernel
}

export { registryRoutes }
