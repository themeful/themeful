import { Injectable } from '@nestjs/common'
import { BaseValue, BaseValues, Client } from '@typings'
import { convertCSSLength, slugify, sortMap } from '@utils'
import { ColorTranslator } from 'colortranslator'
import { writeFileSync } from 'fs'
import { readFileSync as readJsonFile, writeFileSync as writeJsonFile } from 'jsonfile'
import * as smq from 'sort-media-queries'
import { ConfigService } from './config.service'
import { SyncService } from './sync.service'

@Injectable()
export class BaseValueService {
  private baseJson: BaseValues
  private readonly filenameJson = 'baseValues.json'
  private readonly filenameScss = 'baseValues.scss'

  constructor(private readonly syncService: SyncService, private readonly config: ConfigService) {
    this.baseJson = this.loadJson()
    this.generateBaseValues(this.baseJson)
  }

  public create(baseValue: BaseValue, client?: string): BaseValue | null {
    const key = slugify([baseValue.group, baseValue.name])

    baseValue = this.unifyBaseValue(baseValue)

    if (client) {
      if (!this.baseJson.clients[client] || this.baseJson.clients[client].values[key]) {
        return null
      }
      this.baseJson.clients[client].values[key] = baseValue
    } else {
      if (this.baseJson.global[key]) {
        return null
      }
      this.baseJson.global[key] = baseValue
    }

    this.reorder(client)

    this.writeFiles(this.baseJson)
    this.syncService.baseValues({
      values: this.baseValueList(),
      action: 'create',
      primary: slugify([client ?? 'global', baseValue.group, baseValue.name]),
    })

    return baseValue
  }

  public read(): BaseValues {
    return this.baseJson
  }

  public update(name: string, baseValue: BaseValue, client?: string): BaseValue | null {
    const key = slugify([baseValue.group, baseValue.name])

    baseValue = this.unifyBaseValue(baseValue)

    if (client) {
      if (
        !this.baseJson.clients[client]?.values[name] ||
        (key !== name && this.baseJson.clients[client].values[key])
      ) {
        return null
      }
      delete this.baseJson.clients[client].values[name]
      this.baseJson.clients[client].values[key] = baseValue
    } else {
      if (!this.baseJson.global[name] || (key !== name && this.baseJson.global[key])) {
        return null
      }
      delete this.baseJson.global[name]
      this.baseJson.global[key] = baseValue
    }

    this.reorder(client)

    this.writeFiles(this.baseJson)
    this.syncService.baseValues({
      values: this.baseValueList(),
      action: name === key ? 'sync' : 'update',
      primary: `${client ?? 'global'}_${name}`,
      secondary: slugify([client ?? 'global', baseValue.group, baseValue.name]),
    })

    return baseValue
  }

  public delete(name: string, client?: string): boolean {
    if (client) {
      if (!this.baseJson.clients[client] || !this.baseJson.clients[client].values[name]) {
        return false
      }
      delete this.baseJson.clients[client].values[name]
    } else {
      if (!this.baseJson.global[name]) {
        return false
      }
      delete this.baseJson.global[name]
    }

    this.writeFiles(this.baseJson)
    this.syncService.baseValues({
      values: this.baseValueList(),
      action: 'delete',
      primary: `${client ?? 'global'}_${name}`,
    })
    return true
  }

  public createClient({ name, baseFontSize }: Client): boolean {
    const slug = slugify([name])
    if (!this.clientList().includes(slug)) {
      this.baseJson.clients[slug] = {
        client: slug,
        name,
        baseFontSize,
        values: {},
      }
      this.writeFiles(this.baseJson)
      this.syncService.clients({
        values: this.clientList(),
        action: 'create',
        primary: slug,
      })

      return true
    }
    return false
  }

  public updateClient(currentSlug: string, { name, baseFontSize }: Client): boolean {
    const clients = this.clientList()
    const slug = slugify([name])

    this.baseJson.clients[slug] = {
      ...this.baseJson.clients[currentSlug],
      name,
      client: slug,
      baseFontSize,
    }

    if (currentSlug !== slug) {
      delete this.baseJson.clients[currentSlug]
      this.writeFiles(this.baseJson)
      this.syncService.clients({
        values: clients,
        action: 'update',
        primary: currentSlug,
        secondary: slug,
      })
    } else {
      this.writeFiles(this.baseJson)
    }

    return true
  }

  public deleteClient(client: string): boolean {
    const willDelete = !!this.baseJson.clients[client]
    if (willDelete) {
      delete this.baseJson.clients[client]
    }
    const clientList = this.clientList()
    this.syncService.clients({
      values: clientList,
      action: willDelete ? 'delete' : 'sync',
      primary: client,
    })
    if (willDelete) {
      this.writeFiles(this.baseJson)
    }
    return willDelete
  }

  private clientList(): string[] {
    return Object.keys(this.baseJson.clients)
  }

  private baseValueList(): string[] {
    const globalValues = Object.keys(this.baseJson.global).map((name) => `global_${name}`)
    const clientValues = Object.values(this.baseJson.clients).reduce(
      (output, client) => [
        ...output,
        ...Object.keys(client.values).map((name) => `${client.client}_${name}`),
      ],
      []
    )
    return [...globalValues, ...clientValues]
  }

  private loadJson(): BaseValues {
    return readJsonFile(`${this.config.dataPath}${this.filenameJson}`)
  }

  private saveJson(baseValues: BaseValues) {
    return writeJsonFile(`${this.config.dataPath}${this.filenameJson}`, baseValues, { spaces: 2 })
  }

  private reorder(client?: string) {
    const specialeSortTypes = ['mediaquery']
    const section = client ? this.baseJson.clients[client].values : this.baseJson.global
    const convert = convertCSSLength(
      client ? `${this.baseJson.clients[client].baseFontSize}px` : this.config.globalBaseFontSize
    )
    let newSection: { [key: string]: BaseValue } = {}
    let mediaqueries = Object.values(section)
      .filter((bv) => bv.type === 'mediaquery')
      .reduce((result, item) => {
        result.push(item.value)
        return result
      }, [])
    mediaqueries = smq(mediaqueries)

    Object.keys(section).forEach((key: string) => {
      if (!specialeSortTypes.includes(section[key].type)) {
        newSection[key] = section[key]
      }
    })
    newSection = sortMap(newSection, ([aKey, aValue], [bKey, bValue]) => {
      if (aValue.type === bValue.type) {
        if (['size', 'font-size'].includes(aValue.type)) {
          return parseFloat(convert(aValue.value)) > parseFloat(convert(bValue.value)) ? 1 : -1
        }
        return aKey > bKey ? 1 : -1
      }
      return aValue.type > bValue.type ? 1 : -1
    })

    mediaqueries.forEach((mediaquery) => {
      const key = Object.keys(section).filter((key) => section[key].value === mediaquery)[0]
      newSection[key] = section[key]
    })

    if (client) {
      this.baseJson.clients[client].values = newSection
    } else {
      this.baseJson.global = newSection
    }
  }

  private writeFiles(baseValues: BaseValues) {
    this.saveJson(baseValues)
    this.generateBaseValues(baseValues)
  }

  private generateBaseValues(jsonData) {
    const output = []

    for (const key in jsonData.global) {
      const value = jsonData.global[key].value
      output.push({
        key: `global_${key}`,
        type: jsonData.global[key].type,
        value: jsonData.global[key].type === 'color' ? this.unifyColor(value) : value,
      })
    }

    for (const clientKey in jsonData.clients) {
      const client = jsonData.clients[clientKey]
      for (const key in client.values) {
        const value = client.values[key].value
        output.push({
          key: `${clientKey}_${key}`,
          type: client.values[key].type,
          value: client.values[key].type === 'color' ? this.unifyColor(value) : value,
        })
      }
    }
    const attributes = []
    const mediaqueriesAttr = []
    output.forEach((attr) => {
      if (attr.type === 'mediaquery') {
        mediaqueriesAttr.push(
          `@mixin ${attr.key} {\n  @media ${attr.value} {\n    @content;\n  }\n}`
        )
      } else {
        attributes.push(`$${attr.key}: ${attr.value};`)
      }
    })
    writeFileSync(
      `${this.config.generatedPath}${this.filenameScss}`,
      [...attributes, ...mediaqueriesAttr, ''].join('\n')
    )
  }

  private unifyBaseValue(baseValue: BaseValue): BaseValue {
    if (baseValue.type === 'color') {
      baseValue.value = this.unifyColor(baseValue.value)
    }
    baseValue.group = slugify([baseValue.group])
    return baseValue
  }

  private unifyColor(color: string): string {
    if (new ColorTranslator(color).A === 1) {
      return ColorTranslator.toHEX(color).toLowerCase()
    } else {
      return ColorTranslator.toRGBA(color).split(',').join(', ')
    }
  }
}
