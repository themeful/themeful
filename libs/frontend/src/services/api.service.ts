export class APIService {
  private static _instance: APIService

  public getHello() {
    return 'Hello World'
  }

  public static get Instance(): APIService {
    // Do you need arguments? Make it a regular method instead.
    return this._instance || (this._instance = new this())
  }
}
