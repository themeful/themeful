import { Injectable } from '@nestjs/common'
import { getProperty, propertyTypes } from '@properties'
import {
  ExtendedStyle,
  FormatedStyleGuide,
  GroupStyles,
  Style,
  StyleGuide,
  StyleGuideBase,
  StyleGuides,
  StyleMap,
  StylesMap,
  TypeGroupStyles,
} from '@typings'
import { convertCSSLength, slugify, sortMap } from '@utils'
import { ColorTranslator } from 'colortranslator'
import { writeFileSync } from 'fs'
import { readFileSync as readJsonFile, writeFileSync as writeJsonFile } from 'jsonfile'
import * as hash from 'object-hash'
import { ReplaySubject } from 'rxjs'
import { sentenceCase } from 'sentence-case'
import * as smq from 'sort-media-queries'
import { ConfigService } from './config.service'
import { SyncService } from './sync.service'

@Injectable()
export class StyleGuideService {
  private styleGuidesJson: StyleGuides
  private readonly filenameJson = 'styleGuides.json'
  private readonly filenameScss = 'styleGuides.scss'
  private cacheHash
  public styleGuides$ = new ReplaySubject(1)

  constructor(private readonly syncService: SyncService, private readonly config: ConfigService) {
    this.styleGuidesJson = this.loadJson()
    this.generateStyleGuides(this.styleGuidesJson)
    this.styleGuides$.next(this.read())
  }

  private transformValues(data: StyleMap): TypeGroupStyles[] {
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

  private transformGroupValues(data: StyleMap): GroupStyles[] {
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

  public create(style: Style, styleGuide = 'global'): boolean {
    const key = slugify([style.group, style.name])

    style = this.unifyStyle(style)

    if (!this.styleGuidesJson[styleGuide] || this.styleGuidesJson[styleGuide].styles[key]) {
      return false
    }
    this.styleGuidesJson[styleGuide].styles[key] = style

    this.reorder(styleGuide)

    this.writeFiles(this.styleGuidesJson)
    this.syncService.styleGuides({
      values: this.styleList(),
      action: 'create',
      primary: slugify([styleGuide, style.group, style.name]),
    })

    return true
  }

  public read(): FormatedStyleGuide[] {
    return Object.entries(this.styleGuidesJson).map(([slug, data]: [string, StyleGuide]) => ({
      name: data.name,
      slug,
      baseFontSize: data.baseFontSize,
      types: this.transformValues(data.styles),
    }))
  }

  public update(name: string, style: Style, styleGuide = 'global'): boolean {
    const key = slugify([style.group, style.name])

    style = this.unifyStyle(style)

    if (
      !this.styleGuidesJson[styleGuide]?.styles[name] ||
      (key !== name && this.styleGuidesJson[styleGuide].styles[key])
    ) {
      return false
    }
    delete this.styleGuidesJson[styleGuide].styles[name]
    this.styleGuidesJson[styleGuide].styles[key] = style

    this.reorder(styleGuide)

    this.writeFiles(this.styleGuidesJson)
    this.syncService.styleGuides({
      values: this.styleList(),
      action: name === key ? 'sync' : 'update',
      primary: `${styleGuide}_${name}`,
      secondary: slugify([styleGuide, style.group, style.name]),
    })

    return true
  }

  public delete(name: string, styleGuide = 'global'): boolean {
    if (!this.styleGuidesJson[styleGuide] || !this.styleGuidesJson[styleGuide].styles[name]) {
      return false
    }
    delete this.styleGuidesJson[styleGuide].styles[name]

    this.writeFiles(this.styleGuidesJson)
    this.syncService.styleGuides({
      values: this.styleList(),
      action: 'delete',
      primary: `${styleGuide}_${name}`,
    })
    return true
  }

  public createStyleGuide({ name, baseFontSize }: StyleGuideBase): boolean {
    const slug = slugify([name])
    if (!this.styleGuideList().includes(slug)) {
      this.styleGuidesJson[slug] = {
        name,
        baseFontSize,
        styles: {},
      }
      this.writeFiles(this.styleGuidesJson)
      this.syncService.styleGuideBases({
        values: this.styleGuideList(),
        action: 'create',
        primary: slug,
      })

      return true
    }
    return false
  }

  public updateStyleGuide(currentSlug: string, { name, baseFontSize }: StyleGuideBase): boolean {
    const styleGuides = this.styleGuideList()
    const slug = slugify([name])

    this.styleGuidesJson[slug] = {
      ...this.styleGuidesJson[currentSlug],
      name,
      baseFontSize,
    }

    if (currentSlug !== slug) {
      delete this.styleGuidesJson[currentSlug]
      this.writeFiles(this.styleGuidesJson)
      this.syncService.styleGuideBases({
        values: styleGuides,
        action: 'update',
        primary: currentSlug,
        secondary: slug,
      })
    } else {
      this.writeFiles(this.styleGuidesJson)
    }

    return true
  }

  public deleteStyleGuide(styleGuide: string): boolean {
    const willDelete = !!this.styleGuidesJson[styleGuide]
    if (willDelete) {
      delete this.styleGuidesJson[styleGuide]
    }
    const styleGuideList = this.styleGuideList()
    this.syncService.styleGuideBases({
      values: styleGuideList,
      action: willDelete ? 'delete' : 'sync',
      primary: styleGuide,
    })
    if (willDelete) {
      this.writeFiles(this.styleGuidesJson)
    }
    return willDelete
  }

  private styleGuideList(): string[] {
    return Object.keys(this.styleGuidesJson)
  }

  private styleList(): string[] {
    const styleGuideValues = Object.entries(this.styleGuidesJson).reduce(
      (output, [slug, styleGuide]) => [
        ...output,
        ...Object.keys(styleGuide.styles).map((name) => `${slug}_${name}`),
      ],
      []
    )
    return styleGuideValues
  }

  private loadJson(): StyleGuides {
    return readJsonFile(`${this.config.dataPath}${this.filenameJson}`)
  }

  private saveJson(styleGuides: StyleGuides) {
    const newHash = hash(styleGuides)
    if (this.cacheHash !== newHash) {
      this.cacheHash = newHash
      this.styleGuides$.next(this.read())
      writeJsonFile(`${this.config.dataPath}${this.filenameJson}`, styleGuides, { spaces: 2 })
    }
  }

  private reorder(styleGuide = 'global') {
    const specialeSortTypes = ['mediaquery']
    const section = this.styleGuidesJson[styleGuide].styles
    const convert = convertCSSLength(`${this.styleGuidesJson[styleGuide].baseFontSize}px`)
    let newSection: StyleMap = {}
    let mediaqueries = Object.values(section)
      .filter((bv: Style) => bv.type === 'mediaquery')
      .reduce((result: string[], item: Style) => {
        result.push(item.value)
        return result
      }, [])
    mediaqueries = smq(mediaqueries)

    Object.keys(section).forEach((key: string) => {
      if (!specialeSortTypes.includes(section[key].type)) {
        newSection[key] = section[key] as ExtendedStyle
      }
    })
    newSection = sortMap<ExtendedStyle>(newSection, ([aKey, aValue], [bKey, bValue]) => {
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

    this.styleGuidesJson[styleGuide].styles = newSection
  }

  private writeFiles(styleGuides: StyleGuides) {
    this.saveJson(styleGuides)
    this.generateStyleGuides(styleGuides)
  }

  private generateStyleGuides(jsonData: StyleGuides) {
    const output = []

    for (const styleGuideKey in jsonData) {
      const styleGuide = jsonData[styleGuideKey]
      for (const key in styleGuide.styles) {
        const value = styleGuide.styles[key].value
        output.push({
          key: `${styleGuideKey}_${key}`,
          type: styleGuide.styles[key].type,
          value: styleGuide.styles[key].type === 'color' ? this.unifyColor(value) : value,
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

  private unifyStyle(style: Style): Style {
    style.value.replace(';', '')
    if (style.type === 'color') {
      style.value = this.unifyColor(style.value)
    }
    style.group = slugify([style.group])
    return style
  }

  private unifyColor(color: string): string {
    if (new ColorTranslator(color).A === 1) {
      return ColorTranslator.toHEX(color).toLowerCase()
    } else {
      return ColorTranslator.toRGBA(color).split(',').join(', ')
    }
  }
}
