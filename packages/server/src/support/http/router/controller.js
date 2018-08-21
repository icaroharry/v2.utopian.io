// imports.
import express from 'express'
import { each } from 'lodash'

// controller implementation.
export class Controller {
  /**
   * Controller constructor.
   */
  constructor () {
    // start a router instance.
    this.router = new express.Router()
    // start a pre-action middleware array.
    this.preMiddleware = []
    // start a post-action middleware array.
    this.postMiddleware = []
    // start an actions array.
    this.actions = []
  }

  /**
   * Add a pre middleware to the controller stack.
   *
   * @param middleware
   */
  addPreMiddleware (middleware) {
    this.preMiddleware.push(middleware)
  }

  /**
   * Add a post middleware to the controller stack.
   * @param middleware
   */
  addPostMiddleware (middleware) {
    this.postMiddleware.push(middleware)
  }

  /**
   * Register GET action.
   * @param path
   * @param handler
   *
   * @return {e.Router}
   */
  get (path, handler) {
    const actionRouter = new express.Router()
    actionRouter.get(path, handler)
    this.actions.push(actionRouter)
    return actionRouter
  }

  /**
   * Register POST action.
   * @param path
   * @param handler
   *
   * @return {e.Router}
   */
  post (path, handler) {
    const actionRouter = new express.Router()
    actionRouter.post(path, handler)
    this.actions.push(actionRouter)
    return actionRouter
  }

  /**
   * Register POST action.
   * @param path
   * @param handler
   *
   * @return {e.Router}
   */
  put (path, handler) {
    const actionRouter = new express.Router()
    actionRouter.put(path, handler)
    this.actions.push(actionRouter)
    return actionRouter
  }

  /**
   * Register DELETE action.
   * @param path
   * @param handler
   *
   * @return {e.Router}
   */
  delete (path, handler) {
    const actionRouter = new express.Router()
    actionRouter.delete(path, handler)
    this.actions.push(actionRouter)
    return actionRouter
  }

  /**
   * Prepare the controller, registering middleware and actions.
   *
   * @return {express.Router|e.Router}
   */
  prepare () {
    // pre middleware register.
    each(this.preMiddleware, (m) => {
      this.router.use(m)
    })

    // register actions (routes).
    each(this.actions, (m) => {
      this.router.use(m)
    })

    // post middleware register.
    each(this.postMiddleware, (m) => {
      this.router.use(m)
    })

    // return the actual router for the controller.
    return this.router
  }
}

// default export.
export default Controller
