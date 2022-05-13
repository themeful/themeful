import { AliasTokens, DesignTokens, FormatedStyleGuides, Themes } from '@typings'
import { combineLatest, debounceTime, Observable } from 'rxjs'
import { APIService } from './api.service'

export class ThemeService {
  private static _instance: ThemeService
  private apiService: APIService

  public static get Instance(): ThemeService {
    return this._instance || (this._instance = new this())
  }

  private constructor() {
    this.apiService = APIService.Instance
  }

  public combined(): Observable<[FormatedStyleGuides, DesignTokens, AliasTokens, Themes]> {
    return combineLatest([
      this.apiService.styleGuides,
      this.apiService.designTokens,
      this.apiService.aliasTokens,
      this.apiService.themes,
    ]).pipe(debounceTime(500))
  }
}
