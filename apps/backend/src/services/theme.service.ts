import { Injectable } from '@nestjs/common'
import { MediaValueDetail, SyncData, Theme, Themes, ThemeValue } from '@typings'
import { clone, slugify, sortMap, unique } from '@utils'
import * as hash from 'object-hash'
import { ReplaySubject } from 'rxjs'
import { FileService } from './file.service'
import { SyncService } from './sync.service'

@Injectable()
export class ThemeService {
  private themesJson: Themes
  private cacheHash
  public themes$ = new ReplaySubject(1)

  constructor(private readonly syncService: SyncService, private readonly file: FileService) {
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
    if (
      data.action === 'update' &&
      currentClients.includes(data.primary) &&
      !currentClients.includes(data.secondary)
    ) {
      Object.keys(this.themesJson).forEach((slug) => {
        if (this.themesJson[slug].styleGuide === data.primary) {
          const newSlug = slugify([data.secondary, this.themesJson[slug].name])
          this.themesJson[newSlug] = this.changeSlug(
            this.themesJson[slug],
            data.primary,
            data.secondary
          )
          delete this.themesJson[slug]
        }
      })
    }

    if (
      data.action === 'duplicate' &&
      currentClients.includes(data.primary) &&
      !currentClients.includes(data.secondary)
    ) {
      Object.keys(this.themesJson).forEach((slug) => {
        if (this.themesJson[slug].styleGuide === data.primary) {
          const newSlug = slugify([data.secondary, this.themesJson[slug].name])
          this.themesJson[newSlug] = this.changeSlug(
            this.themesJson[slug],
            data.primary,
            data.secondary
          )
        }
      })
    }

    this.writeFiles(this.themesJson)
  }

  private changeSlug(theme: Theme, oldSG: string, newSG: string): Theme {
    const styles = clone(theme.styles)
    Object.entries(styles).forEach(([designToken, medias]) => {
      Object.entries(medias).forEach(([media, data]) => {
        const oldMedia = media
        if (data.style && data.style.startsWith(oldSG)) {
          data.style = data.style.replace(oldSG, newSG)
        }
        if (media.startsWith(oldSG)) {
          media = media.replace(oldSG, newSG)
        }
        styles[designToken][media] = data
        if (oldMedia !== media) {
          delete styles[designToken][oldMedia]
        }
      })
    })
    return { ...theme, styleGuide: newSG, styles }
  }

  private loadJson(): Themes {
    return this.file.load('themes')
  }

  private saveJson(themes: Themes) {
    const newHash = hash(themes)
    if (this.cacheHash !== newHash) {
      this.cacheHash = newHash
      this.themes$.next(themes)
      this.file.save('themes', themes)
    }
  }

  private writeFiles(themes: Themes) {
    this.themesJson = sortMap(themes)
    Object.keys(this.themesJson).forEach((themeKey) => {
      this.themesJson[themeKey].styles = sortMap(this.themesJson[themeKey].styles)
    })
    this.saveJson(this.themesJson)
  }
}
