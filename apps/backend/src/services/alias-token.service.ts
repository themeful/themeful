import { Injectable } from '@nestjs/common'
import { AliasToken, AliasTokenAPI, AliasTokens } from '@typings'
import { sortMap, unique } from '@utils'
import * as hash from 'object-hash'
import { ReplaySubject } from 'rxjs'
import { FindResults, findSync } from '../utils'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { SyncService } from './sync.service'

@Injectable()
export class AliasTokenService {
  private aliasTokens: AliasTokens
  private cacheHash
  public aliasTokens$ = new ReplaySubject(1)

  constructor(
    private readonly syncService: SyncService,
    private readonly config: ConfigService,
    private readonly file: FileService
  ) {
    this.aliasTokens = this.loadJson()
    this.refresh()
    this.aliasTokens$.next(this.aliasTokens)
  }

  public create(aliasToken: AliasTokenAPI): boolean {
    if (this.aliasTokens[aliasToken.token] || !aliasToken.extern) {
      return false
    }
    aliasToken.crawled = false
    const token = aliasToken.token
    delete aliasToken.token

    this.aliasTokens[token] = aliasToken
    this.writeFiles(this.aliasTokens)
    this.syncService.aliasTokens({
      values: this.aliasTokenList(),
      action: 'create',
      primary: token,
    })
    return true
  }

  public read(): AliasTokens {
    return this.aliasTokens
  }

  public update(token: string, aliasToken: AliasTokenAPI): boolean {
    if (!this.aliasTokens[token] || !this.aliasTokens[token].extern) {
      return false
    }

    if (token !== aliasToken.token) {
      if (this.aliasTokens[aliasToken.token]) {
        return false
      }
      delete this.aliasTokens[token]
    }
    const newToken = aliasToken.token
    delete aliasToken.token

    this.aliasTokens[newToken] = aliasToken
    this.writeFiles(this.aliasTokens)
    this.syncService.aliasTokens({
      values: this.aliasTokenList(),
      action: 'update',
      primary: token,
      secondary: newToken,
    })
    return true
  }

  public delete(token: string): boolean {
    if (!this.aliasTokens[token] || !this.aliasTokens[token].extern) {
      return false
    }

    delete this.aliasTokens[token]
    this.writeFiles(this.aliasTokens)
    this.syncService.aliasTokens({
      values: this.aliasTokenList(),
      action: 'delete',
      primary: token,
    })
    return true
  }

  private aliasTokenList(): string[] {
    return Object.keys(this.aliasTokens)
  }

  public refresh = async (): Promise<boolean> => {
    this.writeFiles(await this.parseLib(this.aliasTokens))

    this.syncService.aliasTokens({
      values: this.aliasTokenList(),
      action: 'update',
    })
    return true
  }

  private loadJson(): AliasTokens {
    return this.file.load('aliasTokens')
  }

  private saveJson(aliasTokens: AliasTokens) {
    const newHash = hash(aliasTokens)
    if (this.cacheHash !== newHash) {
      this.cacheHash = newHash
      this.aliasTokens$.next(aliasTokens)
      this.file.save('aliasTokens', aliasTokens)
    }
  }

  private writeFiles(aliasTokens: AliasTokens) {
    this.aliasTokens = sortMap(aliasTokens)
    this.saveJson(this.aliasTokens)
  }

  private parseLib(currentAliasTokens): AliasTokens {
    const term = '\\S+:[^;{]+\\$at[^;]+;'
    const defaultsTerm = '^\\$at[^;]+!default;$'
    const output: AliasTokens = {}
    const defaults: { [token: string]: string } = {}

    const results: FindResults = findSync({ term, flags: 'gm' }, this.config.libPath, '.s[a|c]ss$')
    const defaultResults: FindResults = findSync(
      { term: defaultsTerm, flags: 'gm' },
      this.config.libPath,
      '.s[a|c]ss$'
    )

    for (const file of defaultResults) {
      if (file.matches) {
        for (const line of file.matches) {
          const [, token, value] = line.match(/^\$(\S+):\s+(\S.*)\s+!default;$/i)
          if (token && value) {
            defaults[token] = value
          }
        }
      }
    }

    for (const file of results) {
      let component = file.filename.substring(file.filename.lastIndexOf('/'))
      component = component.substring(1, component.indexOf('.'))
      component = component[0].toUpperCase() + component.slice(1)
      if (file.matches) {
        for (let match of file.matches) {
          match = match.replace(/\r?\n|\r|;/g, ' ')
          const [property, tokens] = match.split(':')
          const tokensArray = tokens.match(/\$at\S+/g) ?? []
          tokensArray.forEach((token) => {
            token = token.substring(1)
            const current: AliasToken = output[token] || {
              component: [],
              files: [],
              properties: [],
              extern: false,
              crawled: true,
              default: defaults[token],
            }

            output[token] = {
              ...current,
              component: unique([...current.component, component]),
              files: unique([...current.files, file.filename]),
              properties: unique([...current.properties, property.trim()]),
            }
          })
        }
      }
    }

    const extern = {}
    for (const key in currentAliasTokens) {
      if (currentAliasTokens[key].extern) {
        extern[key] = currentAliasTokens[key]
      }
    }
    return { ...output, ...extern }
  }
}
