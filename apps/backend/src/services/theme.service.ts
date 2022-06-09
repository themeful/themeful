import { Injectable } from '@nestjs/common'
import { MediaValueDetail, SyncData, Theme, Themes, ThemeValue } from '@typings'
import { clone, slugify, sortMap, unique } from '@utils'
import { take } from 'rxjs'
import { FileService } from './file.service'
import { SyncService } from './sync.service'

@Injectable()
export class ThemeService {
  private themes: Themes

  constructor(private readonly syncService: SyncService, private readonly file: FileService) {
    this.syncService.register('styleGuideBases', this.syncStyleGuideBases)
    this.syncService.register('designTokens', this.syncDesignTokens)
    this.syncService.register('styleGuides', this.syncStyleGuides)

    this.file.themes$.pipe(take(1)).subscribe((themes) => {
      this.themes = themes
      this.file.designTokens$.subscribe((designTokens) => {
        this.syncDesignTokens({
          values: Object.keys(designTokens),
          action: 'sync',
        })
      })
      this.file.styleGuides$.subscribe((styleGuides) => {
        this.syncStyleGuideBases({
          values: Object.keys(styleGuides),
          action: 'sync',
        })
        this.syncStyleGuides({
          values: Object.entries(styleGuides).reduce(
            (output, [slug, styleGuide]) => [
              ...output,
              ...Object.keys(styleGuide.styles).map((name) => `${slug}_${name}`),
            ],
            []
          ),
          action: 'sync',
        })
      })
    })
    this.writeFiles(this.themes)
  }

  public create(theme: Theme): boolean {
    const slug = slugify([theme.styleGuide, theme.name])
    if (this.themes[slug]) {
      return false
    }
    this.themes[slug] = {
      name: theme.name,
      styleGuide: theme.styleGuide,
      styles: theme.styles ?? {},
    }
    this.writeFiles(this.themes)

    return true
  }

  public read(): Themes {
    return this.themes
  }

  public update(key: string, theme: Theme): boolean {
    const slug = slugify([theme.styleGuide, theme.name])
    if (!this.themes[key] || (key !== slug && !!this.themes[slug])) {
      return false
    }

    const values = this.themes[key].styles

    if (key !== slug) {
      delete this.themes[key]
    }

    this.themes[slug] = {
      name: theme.name,
      styleGuide: theme.styleGuide,
      styles: theme.styles ?? values,
    }

    this.writeFiles(this.themes)
    return true
  }

  public duplicate(oldSlug: string, { name }: { name: string }): boolean {
    if (!this.themes[oldSlug]) {
      return false
    }
    const theme = this.themes[oldSlug]
    const newSlug = slugify([theme.styleGuide, name])
    if (this.themes[newSlug] || newSlug === oldSlug) {
      return false
    }

    this.themes[newSlug] = {
      ...theme,
      name,
    }

    this.writeFiles(this.themes)
    return true
  }

  public delete(key: string): boolean {
    if (!this.themes[key]) {
      return false
    }

    delete this.themes[key]

    this.writeFiles(this.themes)
    return true
  }

  public createValue(theme, token, { media, style, direct }: MediaValueDetail): boolean {
    if (!this.themes[theme]?.styles) {
      return false
    }

    if (!this.themes[theme]?.styles[token]) {
      this.themes[theme].styles[token] = {} as ThemeValue
    }

    this.themes[theme].styles[token][media] = { style, direct }

    this.writeFiles(this.themes)
    return true
  }

  public updateValue(
    theme,
    token,
    media,
    { media: newMedia, style, direct }: MediaValueDetail
  ): boolean {
    const designToken = this.themes[theme]?.styles[token]
    if (!designToken || !designToken[media]) {
      return false
    }
    if (media !== newMedia) {
      delete this.themes[theme]?.styles[token][media]
    }

    this.themes[theme].styles[token][newMedia] = { style, direct }

    this.writeFiles(this.themes)
    return true
  }

  public deleteValue(theme, token, media): boolean {
    const designToken = this.themes[theme]?.styles[token]
    if (!designToken || !designToken[media]) {
      return false
    }

    delete designToken[media]

    this.writeFiles(this.themes)
    return true
  }

  private syncStyleGuides = (data: SyncData) => {
    switch (data.action) {
      case 'update':
        Object.values(this.themes).forEach((theme) => {
          const themeName = slugify([theme.styleGuide, theme.name])
          Object.keys(theme.styles).forEach((designToken) => {
            Object.keys(this.themes[themeName].styles[designToken]).forEach((key) => {
              if (key === data.primary) {
                this.themes[themeName].styles[designToken][data.secondary] =
                  this.themes[themeName].styles[designToken][data.primary]
                delete this.themes[themeName].styles[designToken][key]
              } else if (this.themes[themeName].styles[designToken][key].style === data.primary) {
                this.themes[themeName].styles[designToken][key].style = data.secondary
              }
            })
          })
        })
        break
      default:
        Object.values(this.themes).forEach((theme) => {
          const themeName = slugify([theme.styleGuide, theme.name])
          Object.keys(theme.styles).forEach((designToken) => {
            Object.keys(this.themes[themeName].styles[designToken]).forEach((key) => {
              if (!data.values.includes(key) && key !== 'default') {
                delete this.themes[themeName].styles[designToken][key]
              } else if (
                this.themes[themeName].styles[designToken][key].style &&
                !data.values.includes(this.themes[themeName].styles[designToken][key].style)
              ) {
                delete this.themes[themeName].styles[designToken][key]
              }
            })
          })
        })
    }
    this.writeFiles(this.themes)
  }

  private syncDesignTokens = (data: SyncData) => {
    switch (data.action) {
      case 'update':
        Object.values(this.themes).forEach((theme) => {
          const themeName = slugify([theme.styleGuide, theme.name])
          if (theme.styles[data.primary]) {
            this.themes[themeName].styles[data.secondary] = theme.styles[data.primary]
            delete this.themes[themeName].styles[data.primary]
          }
        })
        break
      case 'split':
        Object.entries(this.themes).forEach(([themeName, theme]) => {
          if (theme.styles[data.primary]) {
            this.themes[themeName].styles[data.secondary] = theme.styles[data.primary]
          }
        })
        break
      default:
        Object.values(this.themes).forEach((theme) => {
          const themeName = slugify([theme.styleGuide, theme.name])
          Object.keys(theme.styles).forEach((key) => {
            if (!data.values.includes(key)) {
              delete this.themes[themeName].styles[key]
            }
          })
        })
    }
    this.writeFiles(this.themes)
  }

  private syncStyleGuideBases = (data: SyncData) => {
    const currentClients = unique(Object.values(this.themes).map(({ styleGuide }) => styleGuide))

    switch (data.action) {
      case 'update':
        if (currentClients.includes(data.primary) && !currentClients.includes(data.secondary)) {
          Object.keys(this.themes).forEach((slug) => {
            if (this.themes[slug].styleGuide === data.primary) {
              const newSlug = slugify([data.secondary, this.themes[slug].name])
              this.themes[newSlug] = this.changeSlug(
                this.themes[slug],
                data.primary,
                data.secondary
              )
              delete this.themes[slug]
            }
          })
        }
        break
      case 'duplicate':
        if (currentClients.includes(data.primary) && !currentClients.includes(data.secondary)) {
          Object.keys(this.themes).forEach((slug) => {
            if (this.themes[slug].styleGuide === data.primary) {
              const newSlug = slugify([data.secondary, this.themes[slug].name])
              this.themes[newSlug] = this.changeSlug(
                this.themes[slug],
                data.primary,
                data.secondary
              )
            }
          })
        }
        break
      default:
        Object.keys(this.themes).forEach((slug) => {
          if (!data.values.includes(this.themes[slug].styleGuide)) {
            delete this.themes[slug]
          }
        })
    }

    this.writeFiles(this.themes)
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

  private writeFiles(themes: Themes) {
    this.themes = sortMap(themes)
    Object.keys(this.themes).forEach((themeKey) => {
      if (this.themes[themeKey].styles) {
        this.themes[themeKey].styles = sortMap(this.themes[themeKey].styles)
      }
    })
    this.file.save('themes', this.themes)
  }
}
