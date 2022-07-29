import { Injectable } from '@nestjs/common'
import { Components } from '@typings'
import { anycase2Words, longUuid, sortMap } from '@utils'
import { map, merge, take, timer } from 'rxjs'
import { findSync } from '../utils'
import { ConfigService } from './config.service'
import { FileService } from './file.service'

@Injectable()
export class ComponentService {
  private components: Components

  constructor(private readonly config: ConfigService, private readonly file: FileService) {
    merge(timer(2000).pipe(map(() => ({}))), this.file.components$())
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

  private parseLib(currentComponents: Components): Components {
    const usedIds: string[] = Object.keys(currentComponents)
    const file2id: { [id: string]: string } = {}
    const fileIgnored: { [id: string]: boolean } = {}
    const name2id: { [id: string]: string } = {}

    Object.entries(currentComponents).forEach(([id, component]) => {
      name2id[component.name] = id
      component.files.forEach((file) => {
        file2id[file.path] = id
        fileIgnored[file.path] = file.ignored
      })
    })

    const output: Components = {}
    const results: string[] = []

    this.config.libPaths.forEach((path) => {
      results.push(...findSync(path, '.s[a|c]ss$'))
    })

    results.forEach((file) => {
      let name = file.substring(file.lastIndexOf('/'))
      name = name.substring(1, name.indexOf('.'))
      name = anycase2Words(name)

      let id = file2id[file] || name2id[name]
      if (!id) {
        do {
          id = longUuid()
        } while (usedIds.includes(id))
        file2id[file] = id
        name2id[name] = id
      }

      if (output[id]) {
        output[id].files.push({ path: file, ignored: !!fileIgnored[file] })
      } else {
        output[id] = {
          name,
          files: [{ path: file, ignored: !!fileIgnored[file] }],
          ignored: !!currentComponents[id]?.ignored,
        }
      }
    })

    return output
  }
}
