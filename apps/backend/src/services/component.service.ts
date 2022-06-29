import { Injectable } from '@nestjs/common'
import { Components } from '@typings'
import { sortMap, unique } from '@utils'
import { take } from 'rxjs'
import { FindResults, findSync } from '../utils'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { SyncService } from './sync.service'

@Injectable()
export class ComponentService {
  private components: Components

  constructor(
    private readonly syncService: SyncService,
    private readonly config: ConfigService,
    private readonly file: FileService
  ) {
    this.file
      .components$()
      .pipe(take(1))
      .subscribe((components) => {
        this.components = components
        this.refresh()
      })
  }

  public refresh = async (): Promise<boolean> => {
    this.writeFiles(await this.parseLib(this.components))
    return true
  }

  private writeFiles(components: Components) {
    this.components = sortMap(components)
    this.file.save('components', this.components)
  }

  private parseLib(currentComponents): Components {
    const term = '\\S+:[^;{]+\\$at[^;]+;'
    const defaultsTerm = '^\\$at[^;]+!default;$'
    const output: Components = {}
    const defaults: { [token: string]: string } = {}
    const results: FindResults = []
    const defaultResults: FindResults = []

    this.config.libPaths.forEach((path) => {
      results.push(...findSync({ term, flags: 'gm' }, path, '.s[a|c]ss$'))
      defaultResults.push(...findSync({ term: defaultsTerm, flags: 'gm' }, path, '.s[a|c]ss$'))
    })

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
            const current: Component = output[token] || {
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
    for (const key in currentComponents) {
      if (currentComponents[key].extern) {
        extern[key] = currentComponents[key]
      }
    }
    return { ...output, ...extern }
  }
}
