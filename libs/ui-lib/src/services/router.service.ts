import { createRouter, Router } from 'stencil-router-v2'

export class RouterService {
  private static _instance: RouterService
  private Router: Router

  constructor() {
    this.Router = createRouter()
  }

  public static get Instance(): RouterService {
    return this._instance || (this._instance = new this())
  }

  public getRouter(): Router {
    return this.Router
  }
}
