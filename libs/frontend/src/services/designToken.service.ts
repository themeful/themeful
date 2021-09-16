import { combineLatest, debounceTime, Observable } from 'rxjs'
import { APIService } from './api.service'

export class DesignTokenSerive {
  private static _instance: DesignTokenSerive
  private apiService: APIService

  public static get Instance(): DesignTokenSerive {
    return this._instance || (this._instance = new this())
  }

  private constructor() {
    this.apiService = APIService.Instance
  }

  public combined(): Observable<any> {
    return combineLatest([
      this.apiService.styleGuides,
      this.apiService.designTokens,
      this.apiService.aliasTokens,
      this.apiService.themes,
    ]).pipe(debounceTime(500))
  }
}
