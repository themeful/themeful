export class ClientValueSerive {
  private static _instance: ClientValueSerive

  public static get Instance(): ClientValueSerive {
    return this._instance || (this._instance = new this())
  }
}
