import { StyleGuides } from '@typings'
import { Observable } from 'rxjs'
import { APIService } from './api.service'

export class StyleGuideService {
  private static _instance: StyleGuideService
  private apiService: APIService

  public static get Instance(): StyleGuideService {
    return this._instance || (this._instance = new this())
  }

  private constructor() {
    this.apiService = APIService.Instance
    this.apiService.test()
  }

  public styleGuides(): Observable<StyleGuides> {
    return this.apiService.styleGuides
  }
}
