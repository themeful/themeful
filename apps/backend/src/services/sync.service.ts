import { Injectable } from '@nestjs/common'
import { Callback, Scope, SyncData, SyncStack } from '@typings'

@Injectable()
export class SyncService {
  private stack: SyncStack = {}

  public register(scope: Scope, callback: Callback) {
    if (!this.stack[scope]?.includes(callback)) {
      this.stack[scope] = [...(this.stack[scope] || []), callback]
    }
  }

  public aliasTokens(data: SyncData) {
    this.stack.aliasTokens?.forEach((callback) => callback(data))
  }

  public styleGuideBases(data: SyncData) {
    this.stack.styleGuideBases?.forEach((callback) => callback(data))
  }

  public designTokens(data: SyncData) {
    this.stack.designTokens?.forEach((callback) => callback(data))
  }

  public styleGuides(data: SyncData) {
    this.stack.styleGuides?.forEach((callback) => callback(data))
  }

  public themes(data: SyncData) {
    this.stack.themes?.forEach((callback) => callback(data))
  }
}
