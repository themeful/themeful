import { Injectable } from '@nestjs/common'
import { AliasToken, AliasTokenAPI, AliasTokens } from '@typings'
import { anycase2Words, sortMap, unique } from '@utils'
import { map, merge, take, timer } from 'rxjs'
import { exists, FindInResults, findInSync } from '../utils'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { SyncService } from './sync.service'

@Injectable()
export class AliasTokenService {
  private aliasTokens!: AliasTokens

  constructor(
    private readonly syncService: SyncService,
    private readonly config: ConfigService,
    private readonly file: FileService
  ) {
    merge(timer(2000).pipe(map(() => ({}))), this.file.aliasTokens$())
      .pipe(take(1))
      .subscribe((aliasTokens) => {
        this.aliasTokens = aliasTokens
        this.refresh()
      })
  }

  public create(aliasToken: AliasTokenAPI): boolean {
    if (this.aliasTokens[aliasToken.token] || !aliasToken.extern) {
      return false
    }
    aliasToken.crawled = false
    const token = aliasToken.token
    delete aliasToken.default
    delete (aliasToken as Partial<AliasTokenAPI>).token

    this.aliasTokens[token] = aliasToken
    this.writeFiles(this.aliasTokens)
    return true
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete aliasToken.token

    this.aliasTokens[newToken] = aliasToken
    this.syncService.aliasTokens({
      values: this.aliasTokenList(),
      action: 'update',
      primary: token,
      secondary: newToken,
    })
    this.writeFiles(this.aliasTokens)
    return true
  }

  public delete(token: string): boolean {
    if (!this.aliasTokens[token] || !this.aliasTokens[token].extern) {
      return false
    }

    delete this.aliasTokens[token]
    this.writeFiles(this.aliasTokens)
    return true
  }

  private aliasTokenList(): string[] {
    return Object.keys(this.aliasTokens)
  }

  public refresh = async (): Promise<boolean> => {
    this.writeFiles(await this.parseLib(this.aliasTokens))
    return true
  }

  private writeFiles(aliasTokens: AliasTokens) {
    this.aliasTokens = sortMap(aliasTokens)
    this.file.save('aliasTokens', this.aliasTokens)
  }

  private parseLib(currentAliasTokens: AliasTokens): AliasTokens {
    const term = '\\S+:[^;{]+\\$at[^;]+;'
    const defaultsTerm = '^\\$at[^;]+!default;$'
    const output: AliasTokens = {}
    const defaults: { [token: string]: string } = {}
    const results: FindInResults = []
    const defaultResults: FindInResults = []

    this.config.libPaths.forEach((path) => {
      if (exists(path)) {
        results.push(...findInSync({ term, flags: 'gm' }, path, '.s[a|c]ss$'))
        defaultResults.push(...findInSync({ term: defaultsTerm, flags: 'gm' }, path, '.s[a|c]ss$'))
      } else {
        throw new Error(`Path ${path} does not exist`)
      }
    })

    for (const file of defaultResults) {
      if (file.matches) {
        for (const line of file.matches) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
      component = anycase2Words(component)
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
              component: unique([...(current.component || []), component]),
              files: unique([...(current.files || []), file.filename]),
              properties: unique([...(current.properties || []), property.trim()]),
            }
          })
        }
      }
    }

    const extern: AliasTokens = {}
    for (const key in currentAliasTokens) {
      if (currentAliasTokens[key].extern) {
        extern[key] = currentAliasTokens[key] as AliasToken
      }
    }
    return { ...output, ...extern }
  }
}
