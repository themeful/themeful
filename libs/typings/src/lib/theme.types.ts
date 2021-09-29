import { AliasTokens } from './aliasToken.types'
import { DesignTokens } from './designToken.types'
import { StyleGuides } from './style.types'

export type APIBundle = [Themes, DesignTokens, AliasTokens, StyleGuides]

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
export interface ExtendedValueDetail extends ValueDetail {
  media: string
  name: string
  global: boolean
}
export interface ValueDetail {
  style?: string
  direct?: DirectValue
}

export interface DirectValue {
  value: string
  type: string
}
