export class DesignTokenSerive {
  private static _instance: DesignTokenSerive

  public static get Instance(): DesignTokenSerive {
    return this._instance || (this._instance = new this())
  }
}
