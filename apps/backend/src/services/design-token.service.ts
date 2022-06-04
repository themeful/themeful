import { Injectable } from '@nestjs/common'
import { DesignToken, DesignTokenAPI, DesignTokens, SyncData } from '@typings'
import { slugify, sortMap, uuid } from '@utils'
import { take } from 'rxjs'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { SyncService } from './sync.service'

@Injectable()
export class DesignTokenService {
  private designTokens: DesignTokens
  private useShortDT: boolean

  constructor(
    private readonly syncService: SyncService,
    private readonly config: ConfigService,
    private readonly file: FileService
  ) {
    this.useShortDT = this.config.shortDesignTokens
    this.syncService.register('aliasTokens', this.syncAliasTokens)

    this.file.designTokens$.pipe(take(1)).subscribe((designTokens) => {
      this.designTokens = designTokens
    })
  }

  public create(designToken: DesignTokenAPI): boolean {
    if (this.designTokens[designToken.token]) {
      return false
    }

    const token = this.unifyToken(designToken.name)

    const designTokenData: DesignToken = {
      name: designToken.name,
      short: uuid(),
      type: designToken.type,
      group: designToken.group,
      description: designToken.description,
      properties: designToken.properties ?? [],
      aliasTokens: designToken.aliasTokens ?? [],
    }

    this.designTokens[token] = designTokenData
    this.writeFiles(this.designTokens)
    this.syncService.designTokens({
      values: this.designTokenList(),
      action: 'create',
      primary: token,
    })
    return true
  }

  public read(): DesignTokens {
    if (this.useShortDT) {
      return this.designTokens
    }
    return Object.entries(this.designTokens).reduce((designTokens, [key, designToken]) => {
      delete designToken['short']
      designTokens[key] = designToken
      return designTokens
    }, {})
  }

  public update(token: string, designToken: DesignTokenAPI): boolean {
    if (
      !this.designTokens[token] ||
      (token !== designToken.token && !!this.designTokens[designToken.token])
    ) {
      return false
    }
    const properties = this.designTokens[token].properties
    const aliasTokens = this.designTokens[token].aliasTokens
    const short = this.designTokens[token].short

    if (token !== designToken.token) {
      delete this.designTokens[token]
    }

    const newToken = this.unifyToken(designToken.name)

    const designTokenData: DesignToken = {
      name: designToken.name,
      short: designToken.short ?? short,
      type: designToken.type,
      group: designToken.group,
      description: designToken.description,
      properties: designToken.properties ?? properties,
      aliasTokens: designToken.aliasTokens ?? aliasTokens,
    }

    this.designTokens[newToken] = designTokenData
    this.writeFiles(this.designTokens)
    this.syncService.designTokens({
      values: this.designTokenList(),
      action: token === newToken ? 'sync' : 'update',
      primary: token,
      secondary: newToken,
    })
    return true
  }

  public selectAliasTokens(token: string, aliasTokens: string[]): boolean {
    if (!this.designTokens[token]) {
      return false
    }

    this.designTokens[token].aliasTokens = aliasTokens

    this.writeFiles(this.designTokens)

    return true
  }

  private unifyToken(token: string): string {
    if (token.substr(0, 2) === '--') {
      token = token.substr(2)
    }

    if (token.substr(0, 2) !== 'dt') {
      token = `dt ${token}`
    }

    return slugify([token])
  }

  public delete(token: string): boolean {
    if (!this.designTokens[token]) {
      return false
    }

    delete this.designTokens[token]
    this.writeFiles(this.designTokens)
    this.syncService.designTokens({
      values: this.designTokenList(),
      action: 'delete',
      primary: token,
    })
    return true
  }

  private designTokenList(): string[] {
    return Object.keys(this.designTokens)
  }

  private syncAliasTokens = (data: SyncData) => {
    switch (data.action) {
      case 'update':
        Object.keys(this.designTokens).forEach((designToken) => {
          let aliasTokens = this.designTokens[designToken].aliasTokens
          if (aliasTokens.includes(data.primary)) {
            aliasTokens = aliasTokens.filter((aliasToken) => aliasToken !== data.primary)
            aliasTokens.push(data.secondary)

            this.designTokens[designToken].aliasTokens = aliasTokens
          }
        })
        break
      default:
        Object.keys(this.designTokens).forEach((designToken) => {
          this.designTokens[designToken].aliasTokens = this.designTokens[
            designToken
          ].aliasTokens.filter((aliasToken) => data.values.includes(aliasToken))
        })
    }

    this.writeFiles(this.designTokens)
  }

  private writeFiles(designTokens: DesignTokens) {
    this.designTokens = sortMap(designTokens, ([aKey, aValue], [bKey, bValue]) => {
      if (aValue.group === bValue.group) {
        return aKey > bKey ? 1 : -1
      }
      return aValue.group > bValue.group ? 1 : -1
    })
    Object.keys(this.designTokens).forEach((key) => {
      this.designTokens[key].aliasTokens = this.designTokens[key].aliasTokens.sort()
    })
    this.file.save('designTokens', this.designTokens)
  }
}
