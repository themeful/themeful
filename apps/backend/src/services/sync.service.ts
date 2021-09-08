import { Injectable } from '@nestjs/common'
import { Callback, Scope, SyncData, SyncStack } from '@typings'

@Injectable()
export class SyncService {
  private stack: SyncStack = {}

  public register(scope: Scope, callback: Callback) {
    if (!this.stack[scope]) {
      this.stack[scope] = []
    }
    if (this.stack[scope].indexOf(callback) === -1) {
      this.stack[scope].push(callback)
    }
  }

  public aliasTokens(data: SyncData) {
    this.stack.aliasTokens?.forEach((callback) => callback(data))
  }

  public clients(data: SyncData) {
    this.stack.clients?.forEach((callback) => callback(data))
  }

  public designTokens(data: SyncData) {
    this.stack.designTokens?.forEach((callback) => callback(data))
  }

  public baseValues(data: SyncData) {
    this.stack.baseValues?.forEach((callback) => callback(data))
  }
}
