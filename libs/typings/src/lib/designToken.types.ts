import { ThemeMedias } from './theme.types'

export interface DesignToken {
  short?: string
  token?: string
  type: string
  name: string
  group: string
  description: string
  properties: string[]
  aliasTokens: string[]
}

export interface DesignTokens {
  [key: string]: DesignToken
}

export interface DesignTokenRow {
  name: string
  token: string
  type: string
  description: string
  aliasTokens: string[]
  properties: string[]
  themeValues?: ThemeMedias[]
}
