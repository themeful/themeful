import { AliasTokens } from './aliasToken.types'
import { GlobalConfig } from './config.types'
import { DesignTokens } from './designToken.types'
import { ExtendedStyle, FormatedStyleGuides } from './style.types'

export type APIBundle = [FormatedStyleGuides, DesignTokens, AliasTokens, Themes, GlobalConfig]

export interface Themes {
  [themeSlug: string]: Theme
}

export interface Theme {
  name: string
  styleGuide: string
  styles: ThemeValues
}

export interface ThemeValues {
  [designToken: string]: ThemeValue
}

export interface ThemeValue {
  default?: ValueDetail
  [media: string]: ValueDetail
}

export type ExtendedValueDetails = ExtendedValueDetail[]

export interface ExtendedValueDetail {
  media: string
  name: string
  global: boolean
  style?: ExtendedStyle & { key: string }
  direct?: DirectValue
}

export interface ValueDetail {
  style?: string
  direct?: DirectValue
}

export interface MediaValueDetail extends ValueDetail {
  media: string
}

export interface DirectValue {
  value: string
  type: string
}

export interface ThemeName {
  styleGuide: string
  name: string
  key: string
}
