import { Injectable } from '@nestjs/common'
import { BaseValues, DesignTokens, SyncData, Theme, Themes, ThemeValue } from '@typings'
import { slugify, sortMap, unique } from '@utils'
import { unlinkSync, writeFileSync } from 'fs'
import { readFileSync as readJsonFile, writeFileSync as writeJsonFile } from 'jsonfile'
import * as smq from 'sort-media-queries'
import { ConfigService } from './config.service'
import { SyncService } from './sync.service'

@Injectable()
export class ThemeService {
  private readonly designTokensFilenameJson = 'designTokens.json'
  private readonly baseValuesFilenameJson = 'baseValues.json'
  private readonly filenameJson = 'themes.json'
  private readonly filenameTs = 'themes.ts'
  private readonly filenameScss = 'themes.scss'

  private themesJson: Themes
  private baseValues: BaseValues
  private designTokens: DesignTokens

  private useShortDT: boolean

  constructor(private readonly syncService: SyncService, private readonly config: ConfigService) {
    this.useShortDT = this.config.shortDesignTokens
    this.syncService.register('baseValues', this.syncBaseValues)
    this.syncService.register('designTokens', this.syncDesignTokens)
    this.syncService.register('clients', this.syncClients)
    this.themesJson = this.loadJson()
    this.writeFiles(this.themesJson)
  }

  public create(theme: Theme): Theme | null {
    const slug = slugify([theme.client, theme.name])
    if (this.themesJson[slug]) {
      return null
    }
    this.themesJson[slug] = {
      name: theme.name,
      client: theme.client,
      values: theme.values ?? {},
    }
    this.writeFiles(this.themesJson)

    return theme
  }

  public read(): Themes {
    return this.themesJson
  }

  public update(key: string, theme: Theme): Theme | null {
    const slug = slugify([theme.client, theme.name])
    if (!this.themesJson[key] || (key !== slug && !!this.themesJson[slug])) {
      return null
    }

    const values = this.themesJson[key].values

    if (key !== slug) {
      this.tidyUpThemeFile(this.themesJson[key].client, this.themesJson[key].name)
      delete this.themesJson[key]
    }

    this.themesJson[slug] = {
      name: theme.name,
      client: theme.client,
      values: theme.values ?? values,
    }

    this.writeFiles(this.themesJson)
    return theme
  }

  public delete(key: string): boolean {
    if (!this.themesJson[key]) {
      return false
    }

    this.tidyUpThemeFile(this.themesJson[key].client, this.themesJson[key].name)
    delete this.themesJson[key]

    this.writeFiles(this.themesJson)
    return true
  }

  public createValue(theme, token, { media, baseValue, directValue }): boolean {
    if (!this.themesJson[theme]?.values) {
      return false
    }

    if (!this.themesJson[theme]?.values[token]) {
      this.themesJson[theme].values[token] = {} as ThemeValue
    }

    this.themesJson[theme].values[token][media] = { baseValue, directValue }

    this.writeFiles(this.themesJson)
    return true
  }

  public updateValue(theme, token, media, { media: newMedia, baseValue, directValue }): boolean {
    const designToken = this.themesJson[theme]?.values[token]
    if (!designToken || !designToken[media]) {
      return false
    }
    if (media !== newMedia) {
      delete this.themesJson[theme]?.values[token][media]
    }

    this.themesJson[theme].values[token][newMedia] = { baseValue, directValue }

    this.writeFiles(this.themesJson)
    return true
  }

  public deleteValue(theme, token, media): boolean {
    const designToken = this.themesJson[theme]?.values[token]
    if (!designToken || !designToken[media]) {
      return false
    }

    delete designToken[media]

    this.writeFiles(this.themesJson)
    return true
  }

  private syncBaseValues = (data: SyncData) => {
    switch (data.action) {
      case 'update':
        Object.values(this.themesJson).forEach((theme) => {
          const themeName = slugify([theme.client, theme.name])
          Object.keys(theme.values).forEach((designToken) => {
            Object.keys(this.themesJson[themeName].values[designToken]).forEach((key) => {
              if (key === data.primary) {
                this.themesJson[themeName].values[designToken][data.secondary] =
                  this.themesJson[themeName].values[designToken][data.primary]
                delete this.themesJson[themeName].values[designToken][key]
              } else if (
                this.themesJson[themeName].values[designToken][key].baseValue === data.primary
              ) {
                this.themesJson[themeName].values[designToken][key].baseValue = data.secondary
              }
            })
          })
        })
        break
      default:
        Object.values(this.themesJson).forEach((theme) => {
          const themeName = slugify([theme.client, theme.name])
          Object.keys(theme.values).forEach((designToken) => {
            Object.keys(this.themesJson[themeName].values[designToken]).forEach((key) => {
              if (!data.values.includes(key) && key !== 'default') {
                delete this.themesJson[themeName].values[designToken][key]
              } else if (
                this.themesJson[themeName].values[designToken][key].baseValue &&
                !data.values.includes(this.themesJson[themeName].values[designToken][key].baseValue)
              ) {
                delete this.themesJson[themeName].values[designToken][key]
              }
            })
          })
        })
    }
    this.writeFiles(this.themesJson)
  }

  private syncDesignTokens = (data: SyncData) => {
    switch (data.action) {
      case 'update':
        Object.values(this.themesJson).forEach((theme) => {
          const themeName = slugify([theme.client, theme.name])
          if (theme.values[data.primary]) {
            this.themesJson[themeName].values[data.secondary] = theme.values[data.primary]
            delete this.themesJson[themeName].values[data.primary]
          }
        })
        break
      default:
        Object.values(this.themesJson).forEach((theme) => {
          const themeName = slugify([theme.client, theme.name])
          Object.keys(theme.values).forEach((key) => {
            if (!data.values.includes(key)) {
              delete this.themesJson[themeName].values[key]
            }
          })
          data.values.forEach((key) => {
            if (!theme.values[key]) {
              this.themesJson[themeName].values[key] = undefined
            }
          })
        })
    }
    this.writeFiles(this.themesJson)
  }

  private syncClients = (data: SyncData) => {
    const currentClients = unique(Object.values(this.themesJson).map(({ client }) => client))
    switch (data.action) {
      case 'update':
        if (currentClients.includes(data.primary) && !currentClients.includes(data.secondary)) {
          Object.keys(this.themesJson).forEach((slug) => {
            if (this.themesJson[slug].client === data.primary) {
              const newSlug = slugify([data.secondary, this.themesJson[slug].name])
              this.themesJson[newSlug] = { ...this.themesJson[slug], client: data.secondary }
              this.tidyUpThemeFile(this.themesJson[slug].client, this.themesJson[slug].name)
              delete this.themesJson[slug]
            }
          })
        }
        break
      default:
        Object.keys(this.themesJson).forEach((slug) => {
          if (!data.values.includes(this.themesJson[slug].client)) {
            this.tidyUpThemeFile(this.themesJson[slug].client, this.themesJson[slug].name)
            delete this.themesJson[slug]
          }
        })
    }
    this.writeFiles(this.themesJson)
  }

  private loadJson(): Themes {
    return readJsonFile(`${this.config.dataPath}${this.filenameJson}`)
  }

  private saveJson(themes: Themes) {
    return writeJsonFile(`${this.config.dataPath}${this.filenameJson}`, themes, { spaces: 2 })
  }

  private getClients(): { [key: string]: string } {
    const clients: { [key: string]: string } = {}
    Object.keys(this.baseValues.clients).forEach((client) => {
      clients[client] = this.baseValues.clients[client].name
    })
    return clients
  }

  private writeFiles(themes: Themes) {
    this.baseValues = readJsonFile(`${this.config.dataPath}${this.baseValuesFilenameJson}`)
    this.designTokens = readJsonFile(`${this.config.dataPath}${this.designTokensFilenameJson}`)
    this.themesJson = sortMap(themes)
    Object.keys(this.themesJson).forEach((themeKey) => {
      this.themesJson[themeKey].values = sortMap(this.themesJson[themeKey].values)
    })
    this.saveJson(this.themesJson)
    this.generateThemeTS(this.themesJson)
    this.generateThemes(this.themesJson)
  }

  private generateThemeTS(themes: Themes) {
    let tsFile = 'export const themes = [\n'
    for (const key in themes) {
      const name = `${this.getClients()[themes[key].client]} - ${themes[key].name}`
      tsFile += `  { name: '${name}', slug: '${slugify([
        themes[key].client,
        themes[key].name,
      ])}' },\n`
    }
    tsFile = `${tsFile}]\n`
    writeFileSync(`${this.config.themesPath}${this.filenameTs}`, tsFile)
  }

  private generateThemes(themes: Themes) {
    let storybookThemes = ''
    const mediaQueryOrder = this.mediaQueryOrder()
    for (const key in themes) {
      storybookThemes += `html[data-brand-theme='${key}'] {\n  @import './theme_${key}';\n}\n`
      const baseFontSize = this.baseValues.clients[themes[key].client].baseFontSize
      const baseFontSizeStr =
        baseFontSize === 16 ? '' : `body {\n  font-size: ${baseFontSize}px;\n}\n\n`
      let scssFile = `@import './baseValues.scss';\n\n${baseFontSizeStr}& {\n`
      const mediaQueries: { [key: string]: string[] } = {}
      for (const designToken in themes[key].values) {
        const renderedToken = this.useShortDT ? this.designTokens[designToken].short : designToken
        if (themes[key].values[designToken]) {
          Object.keys(themes[key].values[designToken]).forEach((media) => {
            if (media === 'default') {
              scssFile +=
                `  --${renderedToken}: ` +
                (themes[key].values[designToken].default.baseValue
                  ? `#{$${themes[key].values[designToken].default.baseValue}};\n`
                  : `${themes[key].values[designToken].default.directValue.value};\n`)
            } else {
              mediaQueries[media] = mediaQueries[media] ?? []
              mediaQueries[media].push(
                themes[key].values[designToken][media].baseValue
                  ? `--${renderedToken}: #{$${themes[key].values[designToken][media].baseValue}};`
                  : `--${renderedToken}: ${themes[key].values[designToken][media].directValue.value};`
              )
            }
          })
        }
      }

      const sorted: { [key: string]: string[] } = {}
      mediaQueryOrder.forEach((mq) => {
        if (mediaQueries[mq]) {
          sorted[mq] = mediaQueries[mq]
        }
      })

      scssFile +=
        Object.entries(sorted).reduce((result, [media, values]) => {
          return `${result}  @include ${media} {\n    ${values.join('\n    ')}\n  }\n`
        }, '') + '}\n'

      writeFileSync(
        `${this.config.generatedPath}theme_${slugify([themes[key].client, themes[key].name])}.scss`,
        scssFile
      )
    }
    writeFileSync(`${this.config.generatedPath}_${this.filenameScss}`, storybookThemes)
  }

  private tidyUpThemeFile(client: string, theme: string) {
    unlinkSync(`${this.config.generatedPath}theme_${slugify([client, theme])}.scss`)
  }

  private mediaQueryOrder(): string[] {
    const mediaQueries: { media: string; key: string }[] =
      Object.entries(this.baseValues.global)
        .filter(([, item]) => item.type === 'mediaquery')
        .map(([key, item]) => ({ media: item.value, key: `global_${key}` })) ?? []

    Object.values(this.baseValues.clients).forEach((client) => {
      mediaQueries.push(
        ...(Object.entries(client.values)
          .filter(([, item]) => item.type === 'mediaquery')
          .map(([key, item]) => ({ media: item.value, key: `${client.client}_${key}` })) ?? [])
      )
    })

    return smq(mediaQueries, 'media').map(({ key }) => key)
  }
}
