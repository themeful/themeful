import { BaseValue } from './baseValue.types'

export interface Themes {
  [key: string]: Theme
}

export interface Theme {
  name: string
  client: string
  values: ThemeValues
}

export interface ThemeValues {
  [key: string]: ThemeValue
}

export interface ThemeValue {
  default: ValueDetail
  [key: string]: ValueDetail
}

export interface ValueDetail {
  baseValue?: string
  directValue?: DirectValue
}

export interface DirectValue {
  value: string
  type: string
}

export type ThemeMedias = ThemeMedia[]

export interface ThemeMedia {
  media: string
  name?: string
  global?: boolean
  baseValue?: BaseValue
  directValue?: DirectValue
}

export interface ThemeValueForm {
  medias: string[]
  themeMedia?: ThemeMedia
  token: string
  type: string
  baseValueTypes: {
    key: string
    name: string
  }[]
  theme: string
  bvMap: { [key: string]: BaseValue }
}
