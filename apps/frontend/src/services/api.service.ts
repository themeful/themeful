import {
  AliasTokens,
  ComponentItemBundle,
  ComponentListBundle,
  Components,
  DesignToken,
  DesignTokens,
  FormatedStyleGuides,
  FormIntegrationActions,
  GlobalConfig,
  Style,
  StyleGuideBase,
  Theme,
  ThemeBundle,
  Themes,
  ThemeValue,
} from '@typings'
import { http } from '@utils'
import {
  combineLatest,
  debounceTime,
  Observable,
  of,
  ReplaySubject,
  shareReplay,
  Subject,
} from 'rxjs'
import io from 'socket.io-client'

export class APIService {
  private static _instance: APIService
  private socket
  public themes$ = new ReplaySubject<Themes>(1)
  public toast$ = new Subject()
  public designTokens$ = new ReplaySubject<DesignTokens>(1)
  public styleGuides$ = new ReplaySubject<FormatedStyleGuides>(1)
  public aliasTokens$ = new ReplaySubject<AliasTokens>(1)
  public components$ = new ReplaySubject<Components>(1)
  public config$ = new ReplaySubject<GlobalConfig>(1)
  public themeBundle$: Observable<ThemeBundle> = combineLatest([
    this.styleGuides$,
    this.designTokens$,
    this.aliasTokens$,
    this.themes$,
    this.config$,
  ]).pipe(debounceTime(500), shareReplay(1))
  public componentBundle$: Observable<ComponentItemBundle> = combineLatest([
    this.components$,
    this.styleGuides$,
    this.designTokens$,
    this.aliasTokens$,
    this.themes$,
    this.config$,
  ]).pipe(debounceTime(500), shareReplay(1))
  public componentListBundle$: Observable<ComponentListBundle> = combineLatest([
    this.components$,
    this.aliasTokens$,
    this.themes$,
  ]).pipe(debounceTime(500), shareReplay(1))

  private constructor() {
    this.socket = io('http://localhost:7333')
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
            this.styleGuides$.next(data)
            break
          case 'themes':
            this.themes$.next(data)
            break
          case 'designTokens':
            this.designTokens$.next(data)
            break
          case 'aliasTokens':
            this.aliasTokens$.next(data)
            break
          case 'components':
            this.components$.next(data)
            break
          case 'config':
            this.config$.next(data)
            break
        }
      } else {
        this.toast$.next({
          text: msg,
          status: 'success',
        })
      }
    })
  }

  public action({
    action,
    controller,
    fields,
    identifier,
  }: FormIntegrationActions): Observable<boolean> {
    switch (controller) {
      case 'styleguide':
        return this.dispatchStyleGuide({
          action,
          fields: fields as StyleGuideBase | string,
          identifier: identifier as string,
        })
      case 'style':
        return this.dispatchStyle({
          action,
          fields: fields as Style | string,
          identifier: identifier as {
            style: string
            styleGuide?: string
          },
        })
      case 'theme':
        return this.dispatchTheme({
          action,
          fields: fields as Theme | string,
          identifier: identifier as string,
        })
      case 'themeValue':
        return this.dispatchThemeValue({
          action,
          fields: fields as ThemeValue | string,
          identifier: identifier as { theme: string; designToken: string; media: string },
        })
      case 'aliasToken':
        return this.dispatchAliasToken({ action })
      case 'designToken':
        return this.dispatchDesignToken({
          action,
          fields: fields as DesignToken | string | { selected: string[] },
          identifier: identifier as string,
        })
      default:
        return of(false)
    }
  }

  // Themes
  private dispatchTheme({
    action,
    fields,
    identifier,
  }: {
    action: string
    fields: Theme | string
    identifier: string
  }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createTheme(fields as Theme)
      case 'update':
        return this.updateTheme(identifier, fields as Theme)
      case 'duplicate':
        return this.duplicateTheme(identifier, fields as string)
      case 'delete':
        return this.deleteTheme({ identifier })
      default:
        return of(false)
    }
  }

  public createTheme(theme: Theme): Observable<boolean> {
    return http.post<Theme, boolean>('http://localhost:7333/api/theme', theme)
  }

  public updateTheme(identifier: string, theme: Theme): Observable<boolean> {
    return http.patch<Theme, boolean>(`http://localhost:7333/api/theme/${identifier}`, theme)
  }

  public duplicateTheme(identifier: string, name: string): Observable<boolean> {
    return http.patch<string, boolean>(
      `http://localhost:7333/api/theme/${identifier}/duplicate`,
      name
    )
  }

  public deleteTheme({ identifier }: { identifier: string }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:7333/api/theme/${identifier}`)
  }

  // ThemeValues
  private dispatchThemeValue({
    action,
    fields,
    identifier,
  }: {
    action: string
    fields: ThemeValue | string
    identifier: { theme: string; designToken: string; media: string }
  }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createThemeValue(identifier, fields as ThemeValue)
      case 'update':
        return this.updateThemeValue(identifier, fields as ThemeValue)
      case 'delete':
        return this.deleteThemeValue(identifier)
      default:
        return of(false)
    }
  }

  public createThemeValue(
    { theme, designToken }: { theme: string; designToken: string },
    value: ThemeValue
  ): Observable<boolean> {
    return http.post<ThemeValue, boolean>(
      `http://localhost:7333/api/theme/value/${theme}/${designToken}`,
      value
    )
  }

  public updateThemeValue(
    { theme, designToken, media }: { theme: string; designToken: string; media: string },
    value: ThemeValue
  ): Observable<boolean> {
    return http.patch<ThemeValue, boolean>(
      `http://localhost:7333/api/theme/value/${theme}/${designToken}/${media}`,
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
      `http://localhost:7333/api/theme/value/${theme}/${designToken}/${media}`
    )
  }

  // StyleGuides
  private dispatchStyle({
    action,
    fields,
    identifier,
  }: {
    action: string
    fields: Style | string
    identifier: {
      style: string
      styleGuide?: string
    }
  }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createStyle(fields as Style, identifier as { styleGuide?: string })
      case 'update':
        return this.updateStyle(identifier, fields as Style)
      case 'delete':
        return this.deleteStyle(identifier)
      default:
        return of(false)
    }
  }

  public createStyle(style: Style, { styleGuide }: { styleGuide?: string }): Observable<boolean> {
    return http.post<Style, boolean>(`http://localhost:7333/api/style/${styleGuide ?? ''}`, style)
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
      `http://localhost:7333/api/style/${style}/${styleGuide ?? ''}`,
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
    return http.delete<boolean>(`http://localhost:7333/api/style/${style}/${styleGuide ?? ''}`)
  }

  // DesignTokens
  private dispatchDesignToken({
    action,
    fields,
    identifier,
  }: {
    action: string
    fields: DesignToken | string | { selected: string[] }
    identifier: string
  }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createDesignToken(fields as DesignToken)
      case 'update':
        return this.updateDesignToken(identifier, fields as DesignToken)
      case 'delete':
        return this.deleteDesignToken(identifier)
      case 'split':
        return this.splitDesignToken(identifier, {
          ...(fields as DesignToken),
          aliasTokens: (fields as { selected: string[] }).selected || [],
        })
      case 'updateAliasTokens':
        return this.selectAliasTokens(identifier, (fields as { selected: string[] }).selected || [])
      default:
        return of(false)
    }
  }

  public createDesignToken(fields: DesignToken): Observable<boolean> {
    return http.post<DesignToken, boolean>(`http://localhost:7333/api/design-token`, fields)
  }

  public selectAliasTokens(identifier: string, aliasTokens: string[]): Observable<boolean> {
    return http.patch<string[], boolean>(
      `http://localhost:7333/api/design-token/${identifier}/aliasTokens`,
      aliasTokens
    )
  }

  public updateDesignToken(identifier: string, fields: DesignToken): Observable<boolean> {
    return http.patch<DesignToken, boolean>(
      `http://localhost:7333/api/design-token/${identifier}`,
      fields
    )
  }
  public splitDesignToken(identifier: string, fields: DesignToken): Observable<boolean> {
    return http.patch<DesignToken, boolean>(
      `http://localhost:7333/api/design-token/${identifier}/split`,
      fields
    )
  }

  public deleteDesignToken(identifier: string): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:7333/api/design-token/${identifier}`)
  }

  // StyleGuideBase
  private dispatchStyleGuide({
    action,
    fields,
    identifier,
  }: {
    action: string
    fields: StyleGuideBase | string
    identifier: string
  }): Observable<boolean> {
    switch (action) {
      case 'create':
        return this.createStyleGuide(fields as StyleGuideBase)
      case 'update':
        return this.updateStyleGuide(identifier, fields as StyleGuideBase)
      case 'duplicate':
        return this.duplicateStyleGuide(identifier, fields as string)
      case 'delete':
        return this.deleteStyleGuide(identifier)
      default:
        return of(false)
    }
  }

  public createStyleGuide(styleGuideBase: StyleGuideBase): Observable<boolean> {
    return http.post<StyleGuideBase, boolean>(
      `http://localhost:7333/api/style-guide`,
      styleGuideBase
    )
  }

  public updateStyleGuide(identifier: string, styleGuideBase: StyleGuideBase): Observable<boolean> {
    return http.patch<StyleGuideBase, boolean>(
      `http://localhost:7333/api/style-guide/${identifier}`,
      styleGuideBase
    )
  }

  public duplicateStyleGuide(identifier: string, name: string): Observable<boolean> {
    return http.patch<string, boolean>(
      `http://localhost:7333/api/style-guide/${identifier}/duplicate`,
      name
    )
  }

  public deleteStyleGuide(identifier: string): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:7333/api/style-guide/${identifier}`)
  }

  // AliasTokens
  private dispatchAliasToken({ action }: { action: string }): Observable<boolean> {
    switch (action) {
      case 'rescan':
        return this.rescanAliasTokens()
      default:
        return of(false)
    }
  }

  public rescanAliasTokens(): Observable<boolean> {
    return http.get<boolean>('http://localhost:7333/api/alias-token/rescan')
  }
}
