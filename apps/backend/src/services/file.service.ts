import { Injectable } from '@nestjs/common'
import { getProperty, propertyTypes } from '@properties'
import {
  AliasTokens,
  DesignTokens,
  ExtendedStyle,
  FormatedStyleGuides,
  GroupStyles,
  Style,
  StyleGuide,
  StyleGuides,
  StyleMap,
  StylesMap,
  Themes,
  TypeGroupStyles,
} from '@typings'
import { slugify, unifyColor } from '@utils'
import { existsSync, readdirSync, unlinkSync, writeFileSync } from 'fs'
import { readFileSync as readJsonFile, writeFileSync as writeJsonFile } from 'jsonfile'
import * as hash from 'object-hash'
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, ReplaySubject } from 'rxjs'
import { sentenceCase } from 'sentence-case'
import * as smq from 'sort-media-queries'
import { ConfigService } from './config.service'

@Injectable()
export class FileService {
  private files: { [filename: string]: BehaviorSubject<any> } = {}
  public streams$: { [filename: string]: ReplaySubject<any> } = {}
  private filenames = ['designTokens', 'aliasTokens', 'styleGuides', 'themes']
  private hashKeys: { [file: string]: string } = {}

  constructor(private readonly config: ConfigService) {
    this.preloadFiles()
    this.setupPipes()
  }

  private preloadFiles(): void {
    this.filenames.forEach((filename) => {
      const path = `${this.config.dataPath}${filename}.json`
      if (existsSync(path)) {
        const data = readJsonFile(path)
        this.files[filename] = new BehaviorSubject(data)
        this.streams$[filename] = new ReplaySubject(1)
        this.streams$[filename].next(data)
        this.hashKeys[filename] = hash(data)
      }
    })
  }

  public load(filename: string) {
    return this.files[filename].getValue()
  }

  public get themes$(): ReplaySubject<Themes> {
    return this.streams$['themes']
  }

  public get designTokens$(): ReplaySubject<DesignTokens> {
    return this.streams$['designTokens']
  }

  public get aliasTokens$(): ReplaySubject<AliasTokens> {
    return this.streams$['aliasTokens']
  }

  public get styleGuides$(): ReplaySubject<StyleGuides> {
    return this.streams$['styleGuides']
  }

  public get styleGuidesApi$(): Observable<FormatedStyleGuides> {
    return this.streams$['styleGuides'].pipe(map(this.formatedStyleGuide))
  }

  public save(filename: string, data: any) {
    const newHash = hash(data)
    if (newHash !== this.hashKeys[filename]) {
      this.hashKeys[filename] = newHash
      this.files[filename].next(data)
      writeJsonFile(`${this.config.dataPath}${filename}.json`, data, { spaces: 2 })
    }
  }

  private setupPipes() {
    combineLatest([this.themes$, this.styleGuides$])
      .pipe(debounceTime(100))
      .subscribe(([themes, styleGuides]) => {
        this.themesTs(themes, styleGuides)
      })
    combineLatest([this.themes$, this.designTokens$, this.styleGuides$])
      .pipe(debounceTime(100))
      .subscribe(([themes, designTokens, styleGuides]) => {
        this.themesScss(themes, designTokens, styleGuides)
      })
    combineLatest([this.themes$, this.designTokens$, this.aliasTokens$])
      .pipe(debounceTime(100))
      .subscribe(([themes, designTokens, aliasTokens]) => {
        this.designTokensScss(themes, designTokens, aliasTokens)
      })
    this.styleGuides$.pipe(debounceTime(100)).subscribe((styleGuides) => {
      this.styleGuidesScss(styleGuides)
    })
  }

  private themesTs(themes: Themes, styleGuides: StyleGuides) {
    const styleGuideNames: { [key: string]: string } = {}
    Object.keys(styleGuides).forEach((styleGuide) => {
      styleGuideNames[styleGuide] = styleGuides[styleGuide].name
    })
    let tsFile = 'export const themes = [\n'
    for (const key in themes) {
      const name = `${styleGuideNames[themes[key].styleGuide]} - ${themes[key].name}`
      tsFile += `  { name: '${name}', slug: '${slugify([
        themes[key].styleGuide,
        themes[key].name,
      ])}' },\n`
    }
    tsFile = `${tsFile}]\n`
    writeFileSync(`${this.config.themesPath}themes.ts`, tsFile)
  }

  private themesScss(themes: Themes, designTokens: DesignTokens, styleGuides: StyleGuides) {
    let storybookThemes = ''
    const themeList = []

    const mediaQueries: { media: string; key: string }[] = []

    Object.entries(styleGuides).forEach(([slug, styleGuide]) => {
      mediaQueries.push(
        ...(Object.entries(styleGuide.styles)
          .filter(([, item]: [string, Style]) => item.type === 'mediaquery')
          .map(([key, item]: [string, Style]) => ({ media: item.value, key: `${slug}_${key}` })) ??
          [])
      )
    })

    const mediaQueryOrder = smq(mediaQueries, 'media').map(({ key }) => key)
    for (const key in themes) {
      storybookThemes += `html[data-brand-theme='${key}'] {\n  @import './theme_${key}';\n}\n`
      const baseFontSize = styleGuides[themes[key].styleGuide].baseFontSize
      const baseFontSizeStr =
        baseFontSize === 16 ? '' : `body {\n  font-size: ${baseFontSize}px;\n}\n\n`
      let scssFile = `@import './styleGuides.scss';\n\n${baseFontSizeStr}& {\n`
      const mediaQueries: { [key: string]: string[] } = {}
      for (const designToken in themes[key].styles) {
        const renderedToken = this.config.shortDesignTokens
          ? designTokens[designToken].short
          : designToken
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
      const themeSlug = slugify([themes[key].styleGuide, themes[key].name])
      themeList.push(themeSlug)
      writeFileSync(`${this.config.generatedPath}theme_${themeSlug}.scss`, scssFile)
    }
    writeFileSync(`${this.config.generatedPath}_themes.scss`, storybookThemes)
    readdirSync(this.config.generatedPath).forEach((file) => {
      if (/^theme_.*.scss$/.test(file)) {
        const match = file.match(/^theme_(.*).scss$/)
        if (match[1] && !themeList.includes(match[1])) {
          unlinkSync(`${this.config.generatedPath}${file}`)
        }
      }
    })
  }

  private designTokensScss = (
    themes: Themes,
    designTokens: DesignTokens,
    aliasTokens: AliasTokens
  ) => {
    const output = []
    const themeCount = Object.keys(themes).length
    const dtUsage: { [token: string]: number } = {}

    Object.values(themes).forEach((theme) => {
      Object.entries(theme.styles).forEach(([token, medias]) => {
        if (!dtUsage[token]) {
          dtUsage[token] = 0
        }
        if (dtUsage[token] >= 0 && Object.keys(medias).includes('default')) {
          dtUsage[token]++
        }
        if (!Object.keys(medias).includes('default')) {
          dtUsage[token] = -1
        }
      })
    })

    for (const designToken in designTokens) {
      for (const aliasToken of designTokens[designToken].aliasTokens) {
        output.push({
          aliasToken,
          designToken: this.config.shortDesignTokens
            ? designTokens[designToken].short
            : designToken,
        })
      }
    }

    writeFileSync(
      `${this.config.generatedPath}designTokens.scss`,
      output.reduce((result, { aliasToken, designToken }) => {
        if (!dtUsage[designToken]) {
          if (aliasTokens[aliasToken] && aliasTokens[aliasToken].default) {
            return `${result}$${aliasToken}: ${aliasTokens[aliasToken].default};\n`
          }
          return result
        }
        if (
          (dtUsage[designToken] === -1 || dtUsage[designToken] < themeCount) &&
          aliasTokens[aliasToken].default
        ) {
          return `${result}$${aliasToken}: var(--${designToken}, ${aliasTokens[aliasToken].default});\n`
        }
        return `${result}$${aliasToken}: var(--${designToken});\n`
      }, '')
    )
  }

  private styleGuidesScss(styleGuides: StyleGuides) {
    const output = []

    for (const styleGuideKey in styleGuides) {
      const styleGuide = styleGuides[styleGuideKey]
      for (const key in styleGuide.styles) {
        const value = styleGuide.styles[key].value
        output.push({
          key: `${styleGuideKey}_${key}`,
          type: styleGuide.styles[key].type,
          value: styleGuide.styles[key].type === 'color' ? unifyColor(value) : value,
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
      `${this.config.generatedPath}styleGuides.scss`,
      [...attributes, ...mediaqueriesAttr, ''].join('\n')
    )
  }

  public formatedStyleGuide = (styleGuides: StyleGuides): FormatedStyleGuides => {
    return Object.entries(styleGuides).map(([slug, data]: [string, StyleGuide]) => ({
      name: data.name,
      slug,
      baseFontSize: data.baseFontSize,
      types: this.transformValues(data.styles),
    }))
  }

  private transformValues = (data: StyleMap): TypeGroupStyles[] => {
    const types: TypeGroupStyles[] = []
    propertyTypes.forEach((propertyType) => {
      const typeBVs = Object.keys(data).reduce((result: StyleMap, key: string) => {
        if (data[key].type === propertyType) {
          result[key] = data[key]
        }
        return result
      }, {})
      if (Object.keys(typeBVs).length) {
        const groups = this.transformGroupValues(typeBVs)
        types.push({
          name: getProperty(propertyType).name,
          groups,
        })
      }
    })
    return types
  }

  private transformGroupValues = (data: StyleMap): GroupStyles[] => {
    const noSortTypes = ['mediaquery', 'size', 'font-size']
    const groups: GroupStyles[] = []
    const groupObj: StylesMap = Object.keys(data).reduce((result: StylesMap, key: string) => {
      const value = data[key] as ExtendedStyle
      const group = sentenceCase(value.group)
      value.group = group
      value.slug = key
      if (!result[group]) {
        result[group] = []
      }
      result[group].push(value)
      return result
    }, {})
    Object.keys(groupObj).forEach((group) => {
      groups.push({
        name: sentenceCase(group),
        styles: groupObj[group].sort((a, b) => {
          if (noSortTypes.includes(a.type)) {
            return 1
          }
          return a.name > b.name ? 1 : -1
        }),
      })
    })
    return groups.sort((a, b) => (a.name > b.name ? 1 : -1))
  }
}
