import { Injectable } from '@nestjs/common'
import {
  DesignTokens,
  MediaValueDetail,
  Style,
  StyleGuides,
  SyncData,
  Theme,
  Themes,
  ThemeValue,
} from '@typings'
import { slugify, sortMap, unique } from '@utils'
import { unlinkSync, writeFileSync } from 'fs'
import { readFileSync as readJsonFile, writeFileSync as writeJsonFile } from 'jsonfile'
import * as hash from 'object-hash'
import { ReplaySubject } from 'rxjs'
import * as smq from 'sort-media-queries'
import { ConfigService } from './config.service'
import { SyncService } from './sync.service'

@Injectable()
export class ThemeService {
  private readonly designTokensFilenameJson = 'designTokens.json'
  private readonly styleGuidesFilenameJson = 'styleGuides.json'
  private readonly filenameJson = 'themes.json'
  private readonly filenameTs = 'themes.ts'
  private readonly filenameScss = 'themes.scss'

  private themesJson: Themes
  private styleGuidesJSON: StyleGuides
  private designTokens: DesignTokens

  private useShortDT: boolean
  private cacheHash
  public themes$ = new ReplaySubject(1)

  constructor(private readonly syncService: SyncService, private readonly config: ConfigService) {
    this.useShortDT = this.config.shortDesignTokens
    this.syncService.register('styleGuideBases', this.syncStyleGuideBases)
    this.syncService.register('designTokens', this.syncDesignTokens)
    this.syncService.register('styleGuides', this.syncStyleGuides)
    this.themesJson = this.loadJson()
    this.writeFiles(this.themesJson)
  }

  public create(theme: Theme): boolean {
    const slug = slugify([theme.styleGuide, theme.name])
    if (this.themesJson[slug]) {
      return false
    }
    this.themesJson[slug] = {
      name: theme.name,
      styleGuide: theme.styleGuide,
      styles: theme.styles ?? {},
    }
    this.writeFiles(this.themesJson)

    return true
  }

  public read(): Themes {
    return this.themesJson
  }

  public update(key: string, theme: Theme): boolean {
    const slug = slugify([theme.styleGuide, theme.name])
    if (!this.themesJson[key] || (key !== slug && !!this.themesJson[slug])) {
      return false
    }

    const values = this.themesJson[key].styles

    if (key !== slug) {
      this.tidyUpThemeFile(this.themesJson[key].styleGuide, this.themesJson[key].name)
      delete this.themesJson[key]
    }

    this.themesJson[slug] = {
      name: theme.name,
      styleGuide: theme.styleGuide,
      styles: theme.styles ?? values,
    }

    this.writeFiles(this.themesJson)
    return true
  }

  public delete(key: string): boolean {
    if (!this.themesJson[key]) {
      return false
    }

    this.tidyUpThemeFile(this.themesJson[key].styleGuide, this.themesJson[key].name)
    delete this.themesJson[key]

    this.writeFiles(this.themesJson)
    return true
  }

  public createValue(theme, token, { media, style, direct }: MediaValueDetail): boolean {
    if (!this.themesJson[theme]?.styles) {
      return false
    }

    if (!this.themesJson[theme]?.styles[token]) {
      this.themesJson[theme].styles[token] = {} as ThemeValue
    }

    this.themesJson[theme].styles[token][media] = { style, direct }

    this.writeFiles(this.themesJson)
    return true
  }

  public updateValue(
    theme,
    token,
    media,
    { media: newMedia, style, direct }: MediaValueDetail
  ): boolean {
    const designToken = this.themesJson[theme]?.styles[token]
    if (!designToken || !designToken[media]) {
      return false
    }
    if (media !== newMedia) {
      delete this.themesJson[theme]?.styles[token][media]
    }

    this.themesJson[theme].styles[token][newMedia] = { style, direct }

    this.writeFiles(this.themesJson)
    return true
  }

  public deleteValue(theme, token, media): boolean {
    const designToken = this.themesJson[theme]?.styles[token]
    if (!designToken || !designToken[media]) {
      return false
    }

    delete designToken[media]

    this.writeFiles(this.themesJson)
    return true
  }

  private syncStyleGuides = (data: SyncData) => {
    switch (data.action) {
      case 'update':
        Object.values(this.themesJson).forEach((theme) => {
          const themeName = slugify([theme.styleGuide, theme.name])
          Object.keys(theme.styles).forEach((designToken) => {
            Object.keys(this.themesJson[themeName].styles[designToken]).forEach((key) => {
              if (key === data.primary) {
                this.themesJson[themeName].styles[designToken][data.secondary] =
                  this.themesJson[themeName].styles[designToken][data.primary]
                delete this.themesJson[themeName].styles[designToken][key]
              } else if (
                this.themesJson[themeName].styles[designToken][key].style === data.primary
              ) {
                this.themesJson[themeName].styles[designToken][key].style = data.secondary
              }
            })
          })
        })
        break
      default:
        Object.values(this.themesJson).forEach((theme) => {
          const themeName = slugify([theme.styleGuide, theme.name])
          Object.keys(theme.styles).forEach((designToken) => {
            Object.keys(this.themesJson[themeName].styles[designToken]).forEach((key) => {
              if (!data.values.includes(key) && key !== 'default') {
                delete this.themesJson[themeName].styles[designToken][key]
              } else if (
                this.themesJson[themeName].styles[designToken][key].style &&
                !data.values.includes(this.themesJson[themeName].styles[designToken][key].style)
              ) {
                delete this.themesJson[themeName].styles[designToken][key]
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
          const themeName = slugify([theme.styleGuide, theme.name])
          if (theme.styles[data.primary]) {
            this.themesJson[themeName].styles[data.secondary] = theme.styles[data.primary]
            delete this.themesJson[themeName].styles[data.primary]
          }
        })
        break
      default:
        Object.values(this.themesJson).forEach((theme) => {
          const themeName = slugify([theme.styleGuide, theme.name])
          Object.keys(theme.styles).forEach((key) => {
            if (!data.values.includes(key)) {
              delete this.themesJson[themeName].styles[key]
            }
          })
          data.values.forEach((key) => {
            if (!theme.styles[key]) {
              this.themesJson[themeName].styles[key] = undefined
            }
          })
        })
    }
    this.writeFiles(this.themesJson)
  }

  private syncStyleGuideBases = (data: SyncData) => {
    const currentClients = unique(
      Object.values(this.themesJson).map(({ styleGuide }) => styleGuide)
    )
    switch (data.action) {
      case 'update':
        if (currentClients.includes(data.primary) && !currentClients.includes(data.secondary)) {
          Object.keys(this.themesJson).forEach((slug) => {
            if (this.themesJson[slug].styleGuide === data.primary) {
              const newSlug = slugify([data.secondary, this.themesJson[slug].name])
              this.themesJson[newSlug] = { ...this.themesJson[slug], styleGuide: data.secondary }
              this.tidyUpThemeFile(this.themesJson[slug].styleGuide, this.themesJson[slug].name)
              delete this.themesJson[slug]
            }
          })
        }
        break
      default:
        Object.keys(this.themesJson).forEach((slug) => {
          if (!data.values.includes(this.themesJson[slug].styleGuide)) {
            this.tidyUpThemeFile(this.themesJson[slug].styleGuide, this.themesJson[slug].name)
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
    const newHash = hash(themes)
    if (this.cacheHash !== newHash) {
      this.cacheHash = newHash
      this.themes$.next(themes)
      writeJsonFile(`${this.config.dataPath}${this.filenameJson}`, themes, { spaces: 2 })
    }
  }

  private getStyleGuideBases(): { [key: string]: string } {
    const styleGuides: { [key: string]: string } = {}
    Object.keys(this.styleGuidesJSON).forEach((styleGuide) => {
      styleGuides[styleGuide] = this.styleGuidesJSON[styleGuide].name
    })
    return styleGuides
  }

  private writeFiles(themes: Themes) {
    this.styleGuidesJSON = readJsonFile(`${this.config.dataPath}${this.styleGuidesFilenameJson}`)
    this.designTokens = readJsonFile(`${this.config.dataPath}${this.designTokensFilenameJson}`)
    this.themesJson = sortMap(themes)
    Object.keys(this.themesJson).forEach((themeKey) => {
      this.themesJson[themeKey].styles = sortMap(this.themesJson[themeKey].styles)
    })
    this.saveJson(this.themesJson)
    this.generateThemeTS(this.themesJson)
    this.generateThemes(this.themesJson)
  }

  private generateThemeTS(themes: Themes) {
    let tsFile = 'export const themes = [\n'
    for (const key in themes) {
      const name = `${this.getStyleGuideBases()[themes[key].styleGuide]} - ${themes[key].name}`
      tsFile += `  { name: '${name}', slug: '${slugify([
        themes[key].styleGuide,
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
      const baseFontSize = this.styleGuidesJSON[themes[key].styleGuide].baseFontSize
      const baseFontSizeStr =
        baseFontSize === 16 ? '' : `body {\n  font-size: ${baseFontSize}px;\n}\n\n`
      let scssFile = `@import './styleGuides.scss';\n\n${baseFontSizeStr}& {\n`
      const mediaQueries: { [key: string]: string[] } = {}
      for (const designToken in themes[key].styles) {
        const renderedToken = this.useShortDT ? this.designTokens[designToken].short : designToken
        if (themes[key].styles[designToken]) {
          Object.keys(themes[key].styles[designToken]).forEach((media) => {
            if (media === 'default') {
              scssFile +=
                `  --${renderedToken}: ` +
                (themes[key].styles[designToken].default.style
                  ? `#{$${themes[key].styles[designToken].default.style}};\n`
                  : `${themes[key].styles[designToken].default.direct.value};\n`)
            } else {
              mediaQueries[media] = mediaQueries[media] ?? []
              mediaQueries[media].push(
                themes[key].styles[designToken][media].style
                  ? `--${renderedToken}: #{$${themes[key].styles[designToken][media].style}};`
                  : `--${renderedToken}: ${themes[key].styles[designToken][media].direct.value};`
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
        `${this.config.generatedPath}theme_${slugify([
          themes[key].styleGuide,
          themes[key].name,
        ])}.scss`,
        scssFile
      )
    }
    writeFileSync(`${this.config.generatedPath}_${this.filenameScss}`, storybookThemes)
  }

  private tidyUpThemeFile(styleGuide: string, theme: string) {
    unlinkSync(`${this.config.generatedPath}theme_${slugify([styleGuide, theme])}.scss`)
  }

  private mediaQueryOrder(): string[] {
    const mediaQueries: { media: string; key: string }[] = []

    Object.entries(this.styleGuidesJSON).forEach(([slug, styleGuide]) => {
      mediaQueries.push(
        ...(Object.entries(styleGuide.styles)
          .filter(([, item]: [string, Style]) => item.type === 'mediaquery')
          .map(([key, item]: [string, Style]) => ({ media: item.value, key: `${slug}_${key}` })) ??
          [])
      )
    })

    return smq(mediaQueries, 'media').map(({ key }) => key)
  }
}
