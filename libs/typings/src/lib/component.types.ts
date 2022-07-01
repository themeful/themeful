import { AliasTokens } from './aliasToken.types'
import { GlobalConfig } from './config.types'
import { DesignTokens } from './designToken.types'
import { FormatedStyleGuides } from './style.types'
import { Themes } from './theme.types'

export type ComponentListBundle = [Components, AliasTokens, Themes]

export type ComponentItemBundle = [
  Components,
  FormatedStyleGuides,
  DesignTokens,
  AliasTokens,
  Themes,
  GlobalConfig
]

export interface Components {
  [id: string]: Component
}

export interface Component {
  name: string
  files: ComponentFile[]
  ignored: boolean
}

export interface ComponentFile {
  path: string
  ignored: boolean
}
