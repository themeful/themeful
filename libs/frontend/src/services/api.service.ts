import {
  AliasTokens,
  BaseValue,
  BaseValues,
  Client,
  DesignToken,
  DesignTokens,
  Theme,
  Themes,
  ThemeValue,
} from '@typings'
import { http } from '@utils'
import { Observable } from 'rxjs'

export class APIService {
  private static _instance: APIService

  public static get Instance(): APIService {
    // Do you need arguments? Make it a regular method instead.
    return this._instance || (this._instance = new this())
  }

  // Themes
  public getThemes(): Observable<Themes> {
    return http.get<Themes>('http://localhost:3333/api/theme')
  }

  public createTheme({ theme }: { theme: Theme }): Observable<Theme> {
    return http.post<Theme, Theme>('http://localhost:3333/api/theme', theme)
  }

  public updateTheme({ key, theme }: { key: string; theme: Theme }): Observable<Theme> {
    return http.patch<Theme, Theme>(`http://localhost:3333/api/theme/${key}`, theme)
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
  }): Observable<Theme> {
    return http.post<Theme, ThemeValue>(
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
    return http.patch<boolean, ThemeValue>(
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

  // BaseValues
  public getBaseValues(): Observable<BaseValues> {
    return http.get<BaseValues>('http://localhost:3333/api/base-value')
  }

  public createBaseValue({
    baseValue,
    client,
  }: {
    baseValue: BaseValue
    client?: string
  }): Observable<BaseValue> {
    return http.post<BaseValue, BaseValue>(
      `http://localhost:3333/api/base-value/${client ?? ''}`,
      baseValue
    )
  }

  public updateBaseValue({
    key,
    baseValue,
    client,
  }: {
    key: string
    client?: string
    baseValue: BaseValue
  }): Observable<BaseValue> {
    return http.patch<BaseValue, BaseValue>(
      `http://localhost:3333/api/base-value/${key}/${client ?? ''}`,
      baseValue
    )
  }

  public deleteBaseValue({ key, client }: { key: string; client?: string }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/base-value/${key}/${client ?? ''}`)
  }

  // DesignTokens
  public getDesignTokens(): Observable<DesignTokens> {
    return http.get<DesignTokens>('http://localhost:3333/api/design-token')
  }

  public createDesignToken({ designToken }: { designToken: DesignToken }): Observable<DesignToken> {
    return http.post<DesignToken, DesignToken>(
      `http://localhost:3333/api/design-token`,
      designToken
    )
  }

  public selectAliasTokens({
    key,
    aliasTokens,
  }: {
    key: string
    aliasTokens: AliasTokens
  }): Observable<boolean> {
    return http.patch<boolean, AliasTokens>(
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
  }): Observable<DesignToken> {
    return http.patch<DesignToken, DesignToken>(
      `http://localhost:3333/api/design-token/${key}`,
      designToken
    )
  }

  public deleteDesignToken({ key }: { key: string }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/design-token/${key}`)
  }

  // Clients
  public createClient(client: Client): Observable<boolean> {
    return http.post<boolean, Client>(`http://localhost:3333/api/client`, client)
  }

  public updateClient({ key, name, baseFontSize }: Client): Observable<boolean> {
    return http.patch<boolean, Client>(`http://localhost:3333/api/client/${key}`, {
      name,
      baseFontSize,
    })
  }

  public deleteClient({ key }: { key: string }): Observable<boolean> {
    return http.delete<boolean>(`http://localhost:3333/api/client/${key}`)
  }

  // AliasTokens
  public getAliasTokens(): Observable<AliasTokens> {
    return http.get<AliasTokens>('http://localhost:3333/api/alias-token')
  }

  public rescanAliasTokens(): Observable<boolean> {
    return http.get<boolean>('http://localhost:3333/api/alias-token/rescan')
  }
}
