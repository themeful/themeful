import {
  AliasTokens,
  DesignToken,
  DesignTokens,
  FormatedStyleGuides,
  Style,
  StyleGuideBase,
  StyleGuides,
  Theme,
  Themes,
  ThemeValue,
} from '@typings'
import { http } from '@utils'
import { combineLatest, debounceTime, Observable, ReplaySubject, shareReplay } from 'rxjs'
import io from 'socket.io-client'

export class APIService {
  private static _instance: APIService
  private socket
  public themes = new ReplaySubject<Themes>(1)
  public designTokens = new ReplaySubject<DesignTokens>(1)
  public styleGuides = new ReplaySubject<FormatedStyleGuides>(1)
  public styles = new ReplaySubject<StyleGuides>(1)
  public aliasTokens = new ReplaySubject<AliasTokens>(1)
  public bundle = combineLatest([
    this.styles,
    this.designTokens,
    this.aliasTokens,
    this.themes,
  ]).pipe(debounceTime(500), shareReplay(1))

  private constructor() {
    this.socket = io('http://localhost:3333')
    this.startSocket()
  }

  public static get Instance(): APIService {
    return this._instance || (this._instance = new this())
  }

  private startSocket() {
    this.socket.on('update', ({ msg, type, data }) => {
      if (msg === 'data') {
        switch (type) {
          case 'styleGuides':
            this.styleGuides.next(data)
            break
          case 'styles':
            this.styles.next(data)
            break
          case 'themes':
            this.themes.next(data)
            break
          case 'designTokens':
            this.designTokens.next(data)
            break
          case 'aliasTokens':
            this.aliasTokens.next(data)
            break
        }
      } else {
        console.log(msg)
      }
    })
  }

  public action({ action, controller, fields, identifier }): Observable<boolean> {
    switch (controller) {
      case 'styleguide':
        return this.dispatchStyleGuide({ action, fields, identifier })
      case 'style':
        return this.dispatchStyle({ action, fields, identifier })
      case 'theme':
        return this.dispatchTheme({ action, fields, identifier })
      case 'themeValue':
        return this.dispatchThemeValue({ action, fields, identifier })
      case 'aliasToken':
        return this.dispatchAliasToken({ action })
      case 'aliasTokenSelect':
        return this.dispatchDesignToken({ action: 'updateAliasTokens', fields, identifier })
      case 'designToken':
        return this.dispatchDesignToken({ action, fields, identifier })
    }
  }

  // Themes
  private dispatchTheme({ action, fields, identifier }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createTheme(fields)
      case 'update':
        return this.updateTheme(identifier, fields)
      case 'delete':
        return this.deleteTheme({ identifier })
    }
  }

  public getThemes(): void {
    http.get<Themes>('http://localhost:3333/api/theme').subscribe((data) => {
      this.themes.next(data)
    })
  }

  public createTheme(theme: Theme): Observable<boolean> {
    return http.post<Theme, boolean>('http://localhost:3333/api/theme', theme)
  }

  public updateTheme(identifier: string, theme: Theme): Observable<boolean> {
    return http.patch<Theme, boolean>(`http://localhost:3333/api/theme/${identifier}`, theme)
  }

  public deleteTheme({ identifier }: { identifier: string }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/theme/${identifier}`)
  }

  // ThemeValues
  private dispatchThemeValue({ action, fields, identifier }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createThemeValue(identifier, fields)
      case 'update':
        return this.updateThemeValue(identifier, fields)
      case 'delete':
        return this.deleteThemeValue(identifier)
    }
  }

  public createThemeValue(
    { theme, designToken }: { theme: string; designToken: string },
    value: ThemeValue
  ): Observable<boolean> {
    return http.post<ThemeValue, boolean>(
      `http://localhost:3333/api/theme/value/${theme}/${designToken}`,
      value
    )
  }

  public updateThemeValue(
    { theme, designToken, media }: { theme: string; designToken: string; media: string },
    value: ThemeValue
  ): Observable<boolean> {
    return http.patch<ThemeValue, boolean>(
      `http://localhost:3333/api/theme/value/${theme}/${designToken}/${media}`,
      value
    )
  }

  public deleteThemeValue({
    theme,
    designToken,
    media,
  }: {
    theme: string
    designToken: string
    media: string
  }): Observable<boolean> {
    return http.delete<boolean>(
      `http://localhost:3333/api/theme/value/${theme}/${designToken}/${media}`
    )
  }

  // StyleGuides
  private dispatchStyle({ action, fields, identifier }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createStyle(fields, identifier)
      case 'update':
        return this.updateStyle(identifier, fields)
      case 'delete':
        return this.deleteStyle(identifier)
    }
  }

  public getStyleGuides(): void {
    http.get<StyleGuides>('http://localhost:3333/api/style').subscribe((data) => {
      this.styles.next(data)
    })
  }

  public getFormattedStyleGuides(): void {
    http.get<FormatedStyleGuides>('http://localhost:3333/api/style/formatted').subscribe((data) => {
      this.styleGuides.next(data)
    })
  }

  public createStyle(style: Style, { styleGuide }: { styleGuide?: string }): Observable<boolean> {
    return http.post<Style, boolean>(`http://localhost:3333/api/style/${styleGuide ?? ''}`, style)
  }

  public updateStyle(
    {
      style,
      styleGuide,
    }: {
      style: string
      styleGuide?: string
    },
    value: Style
  ): Observable<boolean> {
    return http.patch<Style, boolean>(
      `http://localhost:3333/api/style/${style}/${styleGuide ?? ''}`,
      value
    )
  }

  public deleteStyle({
    style,
    styleGuide,
  }: {
    style: string
    styleGuide?: string
  }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/style/${style}/${styleGuide ?? ''}`)
  }

  // DesignTokens
  private dispatchDesignToken({ action, fields, identifier }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createDesignToken(fields)
      case 'update':
        return this.updateDesignToken(identifier, fields)
      case 'delete':
        return this.deleteDesignToken(identifier)
      case 'updateAliasTokens':
        return this.selectAliasTokens(identifier, fields?.selected || [])
    }
  }

  public getDesignTokens(): void {
    http.get<DesignTokens>('http://localhost:3333/api/design-token').subscribe((data) => {
      this.designTokens.next(data)
    })
  }

  public createDesignToken(fields: DesignToken): Observable<boolean> {
    return http.post<DesignToken, boolean>(`http://localhost:3333/api/design-token`, fields)
  }

  public selectAliasTokens(identifier: string, aliasTokens: string[]): Observable<boolean> {
    return http.patch<string[], boolean>(
      `http://localhost:3333/api/design-token/${identifier}/aliasTokens`,
      aliasTokens
    )
  }

  public updateDesignToken(identifier: string, fields: DesignToken): Observable<boolean> {
    return http.patch<DesignToken, boolean>(
      `http://localhost:3333/api/design-token/${identifier}`,
      fields
    )
  }

  public deleteDesignToken(identifier: string): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/design-token/${identifier}`)
  }

  // StyleGuideBase
  private dispatchStyleGuide({ action, fields, identifier }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createStyleGuide(fields)
      case 'update':
        return this.updateStyleGuide(identifier, fields)
      case 'delete':
        return this.deleteStyleGuide(identifier)
    }
  }

  public createStyleGuide(styleGuideBase: StyleGuideBase): Observable<boolean> {
    return http.post<StyleGuideBase, boolean>(
      `http://localhost:3333/api/style-guide`,
      styleGuideBase
    )
  }

  public updateStyleGuide(identifier: string, styleGuideBase: StyleGuideBase): Observable<boolean> {
    return http.patch<StyleGuideBase, boolean>(
      `http://localhost:3333/api/style-guide/${identifier}`,
      styleGuideBase
    )
  }

  public deleteStyleGuide(identifier: string): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/style-guide/${identifier}`)
  }

  // AliasTokens
  private dispatchAliasToken({ action }): Observable<boolean> {
    switch (action) {
      case 'rescan':
        return this.rescanAliasTokens()
    }
  }

  public getAliasTokens(): void {
    http.get<AliasTokens>('http://localhost:3333/api/alias-token').subscribe((data) => {
      this.aliasTokens.next(data)
    })
  }

  public rescanAliasTokens(): Observable<boolean> {
    return http.get<boolean>('http://localhost:3333/api/alias-token/rescan')
  }
}
