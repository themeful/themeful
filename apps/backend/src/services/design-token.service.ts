import { Injectable } from '@nestjs/common'
import { DesignToken, DesignTokenAPI, DesignTokens, SyncData } from '@typings'
import { clone, slugify, sortMap, uuid } from '@utils'
import { take } from 'rxjs'
import { FileService } from './file.service'
import { SyncService } from './sync.service'

@Injectable()
export class DesignTokenService {
  private designTokens!: DesignTokens

  constructor(private readonly syncService: SyncService, private readonly file: FileService) {
    this.syncService.register('aliasTokens', this.syncAliasTokens)

    this.file
      .designTokens$()
      .pipe(take(1))
      .subscribe((designTokens) => {
        this.designTokens = designTokens
        this.file.aliasTokens$().subscribe((aliasTokens) => {
          this.syncAliasTokens({
            values: Object.keys(aliasTokens),
            action: 'sync',
          })
        })
      })
  }

  public create(designToken: DesignTokenAPI): boolean {
    if (this.designTokens[designToken.token as string]) {
      return false
    }

    const token = this.unifyToken(designToken.name)

    const usedUUIDs = Object.values(this.designTokens).map(({ short }) => short)
    let short = ''
    do {
      short = uuid()
    } while (usedUUIDs.includes(short))

    const designTokenData: DesignToken = {
      name: designToken.name,
      short,
      type: designToken.type,
      group: designToken.group,
      description: designToken.description,
      properties: designToken.properties ?? [],
      aliasTokens: designToken.aliasTokens ?? [],
    }

    this.designTokens[token] = designTokenData
    this.writeFiles(this.designTokens)

    return true
  }

  public update(token: string, designToken: DesignTokenAPI): boolean {
    if (
      !this.designTokens[token] ||
      (token !== designToken.token && !!this.designTokens[designToken.token as string])
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
    if (token !== newToken) {
      this.syncService.designTokens({
        action: 'update',
        primary: token,
        secondary: newToken,
      })
    }
    this.writeFiles(this.designTokens)
    return true
  }

  public split(oldToken: string, designToken: DesignTokenAPI): boolean {
    const newToken = this.unifyToken(designToken.name)

    if (!this.designTokens[oldToken] || oldToken === newToken || !!this.designTokens[newToken]) {
      return false
    }
    const usedUUIDs = Object.values(this.designTokens).map(({ short }) => short)
    let short = ''
    do {
      short = uuid()
    } while (usedUUIDs.includes(short))

    this.designTokens[newToken] = {
      ...clone(this.designTokens[oldToken]),
      name: designToken.name,
      description: designToken.description,
      aliasTokens: designToken.aliasTokens,
      short,
    }

    this.designTokens[oldToken].aliasTokens = (
      this.designTokens[oldToken].aliasTokens || []
    ).filter((aliasToken) => !designToken.aliasTokens?.includes(aliasToken))

    this.syncService.designTokens({
      action: 'split',
      primary: oldToken,
      secondary: newToken,
    })
    this.writeFiles(this.designTokens)
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
    if (token.substring(0, 2) === '--') {
      token = token.substring(2)
    }

    if (token.substring(0, 2) !== 'dt') {
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

    return true
  }

  private syncAliasTokens = (data: SyncData) => {
    switch (data.action) {
      case 'update':
        Object.keys(this.designTokens).forEach((designToken) => {
          let aliasTokens = this.designTokens[designToken].aliasTokens || []
          if (aliasTokens.includes(data.primary as string)) {
            aliasTokens = aliasTokens.filter((aliasToken) => aliasToken !== data.primary)
            aliasTokens.push(data.secondary as string)
            this.designTokens[designToken].aliasTokens = aliasTokens
          }
        })
        break
      default:
        Object.keys(this.designTokens).forEach((designToken) => {
          this.designTokens[designToken].aliasTokens = (
            this.designTokens[designToken].aliasTokens || []
          ).filter((aliasToken) => data.values?.includes(aliasToken))
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
    const usedUUIDs: string[] = []
    Object.keys(this.designTokens).forEach((key) => {
      if (
        !this.designTokens[key].short ||
        usedUUIDs.includes(this.designTokens[key].short as string)
      ) {
        this.designTokens[key].short = uuid()
      }
      usedUUIDs.push(this.designTokens[key].short as string)

      this.designTokens[key].aliasTokens = (this.designTokens[key].aliasTokens || []).sort()
    })
    this.file.save('designTokens', this.designTokens)
  }
}
