import { BaseValues } from '@typings'
import { Observable } from 'rxjs'
import { APIService } from './api.service'

export class ClientValueSerive {
  private static _instance: ClientValueSerive
  private apiService: APIService

  public static get Instance(): ClientValueSerive {
    return this._instance || (this._instance = new this())
  }

  private constructor() {
    this.apiService = APIService.Instance
  }

  public clientValues(): Observable<BaseValues> {
    return this.apiService.baseValues
  }
}
