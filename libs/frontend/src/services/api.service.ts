import {
  AliasTokens,
  DesignToken,
  DesignTokens,
  Style,
  StyleGuideBase,
  StyleGuides,
  Theme,
  Themes,
  ThemeValue,
} from '@typings'
import { http } from '@utils'
import { Observable, Subject, tap } from 'rxjs'

export class APIService {
  private static _instance: APIService
  public themes = new Subject<Themes>()
  public designTokens = new Subject<DesignTokens>()
  public styleGuides = new Subject<StyleGuides>()
  public aliasTokens = new Subject<AliasTokens>()

  public static get Instance(): APIService {
    return this._instance || (this._instance = new this())
  }

  public test(): string {
    this.getFormattedStyleGuides().subscribe(() => {
      console.log('done')
    })
    return 'Hello'
  }

  // Themes
  public getThemes(): Observable<Themes> {
    return http.get<Themes>('http://localhost:3333/api/theme').pipe(
      tap((data) => {
        this.themes.next(data)
      })
    )
  }

  public createTheme({ theme }: { theme: Theme }): Observable<boolean> {
    return http.post<Theme, boolean>('http://localhost:3333/api/theme', theme)
  }

  public updateTheme({ key, theme }: { key: string; theme: Theme }): Observable<boolean> {
    return http.patch<Theme, boolean>(`http://localhost:3333/api/theme/${key}`, theme)
  }

  public deleteTheme({ key }: { key: string }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/theme/${key}`)
  }

  // ThemeValues
  public createThemeValue({
    theme,
    token,
    value,
  }: {
    theme: string
    token: string
    value: ThemeValue
  }): Observable<boolean> {
    return http.post<ThemeValue, boolean>(
      `http://localhost:3333/api/theme/value/${theme}/${token}`,
      value
    )
  }

  public updateThemeValue({
    theme,
    token,
    media,
    value,
  }: {
    theme: string
    token: string
    media: string
    value: ThemeValue
  }): Observable<boolean> {
    return http.patch<ThemeValue, boolean>(
      `http://localhost:3333/api/theme/value/${theme}/${token}/${media}`,
      value
    )
  }

  public deleteThemeValue({
    theme,
    token,
    media,
  }: {
    theme: string
    token: string
    media: string
  }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/theme/value/${theme}/${token}/${media}`)
  }

  // StyleGuides
  public getStyleGuides(): Observable<StyleGuides> {
    return http.get<StyleGuides>('http://localhost:3333/api/style').pipe(
      tap((data) => {
        this.styleGuides.next(data)
      })
    )
  }

  public getFormattedStyleGuides(): Observable<any> {
    return http.get<any>('http://localhost:3333/api/style/formatted').pipe(
      tap((data) => {
        // this.styleGuides.next(data)
        console.log(data)
      })
    )
  }

  public createStyle({
    style,
    styleGuide,
  }: {
    style: Style
    styleGuide?: string
  }): Observable<boolean> {
    return http.post<Style, boolean>(`http://localhost:3333/api/style/${styleGuide ?? ''}`, style)
  }

  public updateStyle({
    key,
    styleGuide,
    style,
  }: {
    key: string
    styleGuide?: string
    style: Style
  }): Observable<boolean> {
    return http.patch<Style, boolean>(
      `http://localhost:3333/api/style/${key}/${styleGuide ?? ''}`,
      style
    )
  }

  public deleteStyle({
    key,
    styleGuide,
  }: {
    key: string
    styleGuide?: string
  }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/style/${key}/${styleGuide ?? ''}`)
  }

  // DesignTokens
  public getDesignTokens(): Observable<DesignTokens> {
    return http.get<DesignTokens>('http://localhost:3333/api/design-token').pipe(
      tap((data) => {
        this.designTokens.next(data)
      })
    )
  }

  public createDesignToken({ designToken }: { designToken: DesignToken }): Observable<boolean> {
    return http.post<DesignToken, boolean>(`http://localhost:3333/api/design-token`, designToken)
  }

  public selectAliasTokens({
    key,
    aliasTokens,
  }: {
    key: string
    aliasTokens: AliasTokens
  }): Observable<boolean> {
    return http.patch<AliasTokens, boolean>(
      `http://localhost:3333/api/design-token/${key}/aliasTokens`,
      aliasTokens
    )
  }

  public updateDesignToken({
    key,
    designToken,
  }: {
    key: string
    designToken: DesignToken
  }): Observable<boolean> {
    return http.patch<DesignToken, boolean>(
      `http://localhost:3333/api/design-token/${key}`,
      designToken
    )
  }

  public deleteDesignToken({ key }: { key: string }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/design-token/${key}`)
  }

  // StyleGuideBase
  public createClient(styleGuideBase: StyleGuideBase): Observable<boolean> {
    return http.post<StyleGuideBase, boolean>(
      `http://localhost:3333/api/style-guide`,
      styleGuideBase
    )
  }

  public updateClient(key: string, styleGuideBase: StyleGuideBase): Observable<boolean> {
    return http.patch<StyleGuideBase, boolean>(
      `http://localhost:3333/api/style-guide/${key}`,
      styleGuideBase
    )
  }

  public deleteClient({ key }: { key: string }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/style-guide/${key}`)
  }

  // AliasTokens
  public getAliasTokens(): Observable<AliasTokens> {
    return http.get<AliasTokens>('http://localhost:3333/api/alias-token').pipe(
      tap((data) => {
        this.aliasTokens.next(data)
      })
    )
  }

  public rescanAliasTokens(): Observable<boolean> {
    return http.get<boolean>('http://localhost:3333/api/alias-token/rescan')
  }
}
