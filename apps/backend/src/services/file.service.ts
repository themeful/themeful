import { Injectable } from '@nestjs/common'
import { getProperty, propertyTypes } from '@properties'
import {
  AliasTokens,
  Data,
  DesignTokens,
  ExtendedStyle,
  FormatedStyleGuides,
  GlobalConfig,
  GroupStyles,
  StyleGuide,
  StyleGuides,
  StyleMap,
  StylesMap,
  Themes,
  TypeGroupStyles,
} from '@typings'
import { existsSync } from 'fs'
import { readFileSync as readJsonFile, writeFileSync as writeJsonFile } from 'jsonfile'
import * as hash from 'object-hash'
import { combineLatest, debounceTime, map, Observable, ReplaySubject } from 'rxjs'
import { sentenceCase } from 'sentence-case'
import { designTokensScss, styleGuidesScss, themesScss, themesTs } from '../generators'
import { ConfigService } from './config.service'

@Injectable()
export class FileService {
  private filenames = ['designTokens', 'aliasTokens', 'styleGuides', 'themes']
  private hashKeys: { [file: string]: string } = {}
  private _themes$ = new ReplaySubject<Themes>(1)
  private _designTokens$ = new ReplaySubject<DesignTokens>(1)
  private _aliasTokens$ = new ReplaySubject<AliasTokens>(1)
  private _styleGuides$ = new ReplaySubject<StyleGuides>(1)
  private _config$ = new ReplaySubject<GlobalConfig>(1)

  constructor(private readonly config: ConfigService) {
    this.preloadFiles()
    this.setupPipes()
  }

  public themes$(): ReplaySubject<Themes> {
    return this._themes$
  }

  public designTokens$(): ReplaySubject<DesignTokens> {
    return this._designTokens$
  }

  public aliasTokens$(): ReplaySubject<AliasTokens> {
    return this._aliasTokens$
  }

  public styleGuides$(): ReplaySubject<StyleGuides> {
    return this._styleGuides$
  }

  public config$(): ReplaySubject<GlobalConfig> {
    return this._config$
  }

  private preloadFiles(): void {
    this._config$.next({
      baseFontSize: this.config.baseFontSize,
      shortDesignTokens: this.config.shortDesignTokens,
    })
    this.filenames.forEach((filename) => {
      const path = `${this.config.dataPath}${filename}.json`
      if (existsSync(path)) {
        const data = readJsonFile(path)
        this[`_${filename}$`].next(data)
        this.hashKeys[filename] = hash(data)
      }
    })
  }

  public styleGuidesApi$(): Observable<FormatedStyleGuides> {
    return this._styleGuides$.pipe(
      map((styleGuides: StyleGuides): FormatedStyleGuides => {
        return Object.entries(styleGuides).map(([slug, data]: [string, StyleGuide]) => ({
          name: data.name,
          slug,
          baseFontSize: data.baseFontSize,
          types: this.transformValues(data.styles),
        }))
      })
    )
  }

  public save(filename: string, data: Data) {
    const newHash = hash(data)
    if (newHash !== this.hashKeys[filename]) {
      this.hashKeys[filename] = newHash
      this[`_${filename}$`].next(data)
      writeJsonFile(`${this.config.dataPath}${filename}.json`, data, { spaces: 2 })
    }
  }

  private setupPipes() {
    combineLatest([this._themes$, this._styleGuides$])
      .pipe(debounceTime(100))
      .subscribe(([themes, styleGuides]) => {
        themesTs(this.config.generatedPath, themes, styleGuides)
      })
    combineLatest([this._themes$, this._designTokens$, this._styleGuides$])
      .pipe(debounceTime(100))
      .subscribe(([themes, designTokens, styleGuides]) => {
        themesScss(
          this.config.themesPath,
          this.config.shortDesignTokens,
          themes,
          designTokens,
          styleGuides
        )
      })
    combineLatest([this._themes$, this._designTokens$, this._aliasTokens$])
      .pipe(debounceTime(100))
      .subscribe(([themes, designTokens, aliasTokens]) => {
        designTokensScss(
          this.config.themesPath,
          this.config.shortDesignTokens,
          themes,
          designTokens,
          aliasTokens
        )
      })
    this._styleGuides$.pipe(debounceTime(100)).subscribe((styleGuides) => {
      styleGuidesScss(this.config.themesPath, styleGuides)
    })
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
