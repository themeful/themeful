import { AliasTokens } from './aliasToken.types'
import { DesignTokens } from './designToken.types'
import { ExtendedStyle, StyleGuides } from './style.types'

export type APIBundle = [StyleGuides, DesignTokens, AliasTokens, Themes]

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
  default: ValueDetail
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

export interface DirectValue {
  value: string
  type: string
}

export interface ThemeName {
  styleGuide: string
  name: string
  key: string
}
