import {
  AliasTokens,
  BaseValue,
  BaseValues,
  Client,
  DesignToken,
  DesignTokens,
  Theme,
  Themes,
} from '@typings'
import { from, Observable } from 'rxjs'

export class APIService {
  private static _instance: APIService

  public static get Instance(): APIService {
    // Do you need arguments? Make it a regular method instead.
    return this._instance || (this._instance = new this())
  }

  // Themes
  public getThemes(): Observable<Themes> {
    return from(
      fetch('http://localhost:3333/api/theme') as unknown as Promise<Themes>
    ) as Observable<Themes>
  }

  public createTheme({ theme }: any): Observable<Theme> {
    return from(
      fetch(`http://localhost:3333/api/theme`, {
        method: 'POST',
        body: JSON.stringify(theme),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as unknown as Promise<Theme>
    ) as Observable<Theme>
  }

  public updateTheme({ key, theme }: any): Observable<Theme> {
    return this.http.patch(`http://localhost:3333/api/theme/${key}`, theme) as Observable<Theme>
  }

  public deleteTheme({ key }: any): Observable<boolean> {
    return this.http.delete(`http://localhost:3333/api/theme/${key}`) as Observable<boolean>
  }

  // ThemeValues
  public createThemeValue({ theme, token, value }: any): Observable<Theme> {
    return this.http.post(
      `http://localhost:3333/api/theme/value/${theme}/${token}`,
      value
    ) as Observable<Theme>
  }

  public updateThemeValue({ theme, token, media, value }: any): Observable<boolean> {
    return this.http.patch(
      `http://localhost:3333/api/theme/value/${theme}/${token}/${media}`,
      value
    ) as Observable<boolean>
  }

  public deleteThemeValue({ theme, token, media }: any): Observable<boolean> {
    return this.http.delete(
      `http://localhost:3333/api/theme/value/${theme}/${token}/${media}`
    ) as Observable<boolean>
  }

  // BaseValues
  public getBaseValues(): Observable<BaseValues> {
    return from(
      fetch('http://localhost:3333/api/base-value') as unknown as Promise<BaseValues>
    ) as Observable<BaseValues>
  }

  public createBaseValue({ baseValue, client }: any): Observable<BaseValue> {
    return this.http.post(
      `http://localhost:3333/api/base-value/${client ?? ''}`,
      baseValue
    ) as Observable<BaseValue>
  }

  public updateBaseValue({ key, baseValue, client }: any): Observable<BaseValue> {
    return this.http.patch(
      `http://localhost:3333/api/base-value/${key}/${client ?? ''}`,
      baseValue
    ) as Observable<BaseValue>
  }

  public deleteBaseValue({ key, client }: any): Observable<boolean> {
    return this.http.delete(
      `http://localhost:3333/api/base-value/${key}/${client ?? ''}`
    ) as Observable<boolean>
  }

  // DesignTokens
  public getDesignTokens(): Observable<DesignTokens> {
    return from(
      fetch('http://localhost:3333/api/design-token') as unknown as Promise<DesignTokens>
    ) as Observable<DesignTokens>
  }

  public createDesignToken({ designToken }: any): Observable<DesignToken> {
    return this.http.post(
      `http://localhost:3333/api/design-token`,
      designToken
    ) as Observable<DesignToken>
  }

  public selectAliasTokens({ key, aliasTokens }: any): Observable<boolean> {
    return this.http.patch(
      `http://localhost:3333/api/design-token/${key}/aliasTokens`,
      aliasTokens
    ) as Observable<boolean>
  }

  public updateDesignToken({ key, designToken }: any): Observable<DesignToken> {
    return this.http.patch(
      `http://localhost:3333/api/design-token/${key}`,
      designToken
    ) as Observable<DesignToken>
  }

  public deleteDesignToken({ key }: any): Observable<boolean> {
    return this.http.delete(`http://localhost:3333/api/design-token/${key}`) as Observable<boolean>
  }

  // Clients
  public createClient({ name, baseFontSize }: Client): Observable<boolean> {
    return this.http.post(`http://localhost:3333/api/client`, {
      name,
      baseFontSize,
    }) as Observable<boolean>
  }

  public updateClient({ key, name, baseFontSize }: Client): Observable<boolean> {
    return this.http.patch(`http://localhost:3333/api/client/${key}`, {
      name,
      baseFontSize,
    }) as Observable<boolean>
  }

  public deleteClient({ key }: any): Observable<boolean> {
    return this.http.delete(`http://localhost:3333/api/client/${key}`) as Observable<boolean>
  }

  // AliasTokens
  public getAliasTokens(): Observable<AliasTokens> {
    return from(
      fetch('http://localhost:3333/api/alias-token') as unknown as Promise<AliasTokens>
    ) as Observable<AliasTokens>
  }

  public rescanAliasTokens(): Observable<boolean> {
    return from(
      fetch('http://localhost:3333/api/alias-token/rescan') as unknown as Promise<boolean>
    ) as Observable<boolean>
  }
}
