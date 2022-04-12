import { Injectable } from '@nestjs/common'
import { DesignToken, DesignTokenAPI, DesignTokens, SyncData } from '@typings'
import { slugify, sortMap, uuid } from '@utils'
import { writeFileSync } from 'fs'
import { readFileSync as readJsonFile, writeFileSync as writeJsonFile } from 'jsonfile'
import { ConfigService } from './config.service'
import { SyncService } from './sync.service'

@Injectable()
export class DesignTokenService {
  private designTokensJson: DesignTokens
  private readonly filenameJson = 'designTokens.json'
  private readonly filenameScss = 'designTokens.scss'
  private useShortDT: boolean

  constructor(private readonly syncService: SyncService, private readonly config: ConfigService) {
    this.useShortDT = this.config.shortDesignTokens
    this.syncService.register('aliasTokens', this.syncAliasTokens)
    this.designTokensJson = this.loadJson()
    this.generateAt2DtMap(this.designTokensJson)
  }

  public create(designToken: DesignTokenAPI): boolean {
    if (this.designTokensJson[designToken.token]) {
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

    this.designTokensJson[token] = designTokenData
    this.writeFiles(this.designTokensJson)
    this.syncService.designTokens({
      values: this.designTokenList(),
      action: 'create',
      primary: token,
    })
    return true
  }

  public read(): DesignTokens {
    if (this.useShortDT) {
      return this.designTokensJson
    }
    return Object.entries(this.designTokensJson).reduce((designTokens, [key, designToken]) => {
      delete designToken['short']
      designTokens[key] = designToken
      return designTokens
    }, {})
  }

  public update(token: string, designToken: DesignTokenAPI): boolean {
    if (
      !this.designTokensJson[token] ||
      (token !== designToken.token && !!this.designTokensJson[designToken.token])
    ) {
      return false
    }
    const properties = this.designTokensJson[token].properties
    const aliasTokens = this.designTokensJson[token].aliasTokens
    const short = this.designTokensJson[token].short

    if (token !== designToken.token) {
      delete this.designTokensJson[token]
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

    this.designTokensJson[newToken] = designTokenData
    this.writeFiles(this.designTokensJson)
    this.syncService.designTokens({
      values: this.designTokenList(),
      action: token === newToken ? 'sync' : 'update',
      primary: token,
      secondary: newToken,
    })
    return true
  }

  public selectAliasTokens(token: string, aliasTokens: string[]): boolean {
    if (!this.designTokensJson[token]) {
      return false
    }

    this.designTokensJson[token].aliasTokens = aliasTokens

    this.writeFiles(this.designTokensJson)

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
    if (!this.designTokensJson[token]) {
      return false
    }

    delete this.designTokensJson[token]
    this.writeFiles(this.designTokensJson)
    this.syncService.designTokens({
      values: this.designTokenList(),
      action: 'delete',
      primary: token,
    })
    return true
  }

  private designTokenList(): string[] {
    return Object.keys(this.designTokensJson)
  }

  private syncAliasTokens = (data: SyncData) => {
    switch (data.action) {
      case 'update':
        Object.keys(this.designTokensJson).forEach((designToken) => {
          let aliasTokens = this.designTokensJson[designToken].aliasTokens
          if (aliasTokens.includes(data.primary)) {
            aliasTokens = aliasTokens.filter((aliasToken) => aliasToken !== data.primary)
            aliasTokens.push(data.secondary)

            this.designTokensJson[designToken].aliasTokens = aliasTokens
          }
        })
        break
      default:
        Object.keys(this.designTokensJson).forEach((designToken) => {
          this.designTokensJson[designToken].aliasTokens = this.designTokensJson[
            designToken
          ].aliasTokens.filter((aliasToken) => data.values.includes(aliasToken))
        })
    }

    this.writeFiles(this.designTokensJson)
  }

  private loadJson(): DesignTokens {
    return readJsonFile(`${this.config.dataPath}${this.filenameJson}`)
  }

  private saveJson(designTokens: DesignTokens) {
    return writeJsonFile(`${this.config.dataPath}${this.filenameJson}`, designTokens, { spaces: 2 })
  }

  private writeFiles(designTokens: DesignTokens) {
    this.designTokensJson = sortMap(designTokens, ([aKey, aValue], [bKey, bValue]) => {
      if (aValue.group === bValue.group) {
        return aKey > bKey ? 1 : -1
      }
      return aValue.group > bValue.group ? 1 : -1
    })
    Object.keys(this.designTokensJson).forEach((key) => {
      this.designTokensJson[key].aliasTokens = this.designTokensJson[key].aliasTokens.sort()
    })
    this.saveJson(this.designTokensJson)
    this.generateAt2DtMap(this.designTokensJson)
  }

  private generateAt2DtMap(jsonData: DesignTokens) {
    const output = []

    for (const designToken in jsonData) {
      for (const aliasToken of jsonData[designToken].aliasTokens) {
        output.push({
          aliasToken,
          designToken: this.useShortDT ? jsonData[designToken].short : designToken,
        })
      }
    }

    writeFileSync(
      `${this.config.generatedPath}${this.filenameScss}`,
      output.reduce((result, { aliasToken, designToken }) => {
        return `${result}$${aliasToken}: var(--${designToken});\n`
      }, '')
    )
  }
}
