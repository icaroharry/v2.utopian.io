import { forEach, castArray } from 'lodash'
import { Router } from 'express'
import prepareHandler from '../../prepareHandler'

/**
 * get handlers functions from router definition
 * @method getHandlers
 * @param  {Object}    route
 * @return {Array<Function>}          
 */
const getHandlers = route => {
  const handlers = castArray(route.handler)
  const last = prepareHandler(handlers.pop())

  return [...handlers, last]
}

/**
 * add routes to Router instance
 * @method addRoutesToRouter
 * @param  {Router}           router
 * @param  {Array<Object>}    routes
 *
 * @return {Router}
 */
const addRoutesToRouter = (router, routes) => {
  forEach(castArray(routes), route => {
    const { methods, path } = route
    forEach(castArray(methods), method => {
      router[method](path, ...getHandlers(route))
    })
  })

  return router
}

/**
 * create Router instance from route definition
 * @method routerFactory
 * @param  {Object}       definition
 * @return {Router}
 */
const routerFactory = definition => {
  const router = new Router()
  const { routes } = definition

  return addRoutesToRouter(router, routes)
}

/**
 * registry routes definitions on httpKernel instance
 * @method registerRouterDefinition
 * @param  {Router}                 httpKernel
 * @param  {Object}                 definition
 * @return {Router}
 */
const registerRouterDefinition = (httpKernel, definition) => {
  const router = routerFactory(definition)

  httpKernel.use(definition.prefix, router)

  return httpKernel
}

export { registerRouterDefinition }
