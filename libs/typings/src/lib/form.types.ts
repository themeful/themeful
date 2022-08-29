import { KeyValues } from './keyValue.types'
import { ExtendedStyle, StyleGuideBase, StyleMap } from './style.types'
import { DirectValue } from './theme.types'

// --------- Common ------------
export type FormActions =
  | StyleGuideFormAction
  | StyleFormAction
  | ThemeFormAction
  | DesignTokenFormAction
  | AliasTokenFormAction

export type FormIntegrationActions =
  | StyleGuideIntegrationAction
  | ThemeValueIntegrationAction
  | StyleIntegrationAction
  | ThemeIntegrationAction
  | DesignTokenIntegrationAction
  | AliasTokenIntegrationAction

export type FormIntegrations =
  | StyleGuideIntegration
  | StyleIntegration
  | ThemeIntegration
  | DesignTokenIntegration
  | AliasTokenIntegration

export interface FormValues {
  [key: string]: string | number
}

// --------- Style Guide Form ------------
export type StyleGuideIntegration = StyleGuideFormData & {
  form: 'styleguide'
}

export interface StyleGuideFormData {
  identifier?: string
  fields?: StyleGuideBase
}

export type StyleGuideFormAction =
  | OpenAction
  | CloseAction
  | StyleGuideCreateAction
  | StyleGuideUpdateAction
  | StyleGuideDuplicateAction
  | StyleGuideDeleteAction

export type StyleGuideIntegrationAction = StyleGuideFormAction & {
  controller: 'styleguide'
  identifier?: string
  fields?: StyleGuideBase
}

export interface CloseAction {
  action: 'close'
}
export interface OpenAction {
  action: 'open'
}

export interface StyleGuideCreateAction {
  action: 'create'
  fields: StyleGuideBase
}

export interface StyleGuideUpdateAction {
  action: 'update'
  identifier: string
  fields: StyleGuideBase
}

export interface StyleGuideDuplicateAction {
  controller: string
  action: 'duplicate'
  identifier: string
  fields: { name: string }
}

export interface StyleGuideDeleteAction {
  action: 'delete'
  identifier: string
}

// --------- Style Form ------------
export type StyleIntegration = StyleFormData & {
  form: 'style'
}

export interface StyleFormData {
  identifier?: StyleIdentifier
  fields?: ExtendedStyle
  groups: string[]
  propertyTypes: KeyValues
}

export type StyleFormAction =
  | OpenAction
  | CloseAction
  | StyleCreateAction
  | StyleUpdateAction
  | StyleDeleteAction

export type StyleIntegrationAction = StyleFormAction & {
  controller: 'style'
  identifier?: StyleIdentifier
  fields?: ExtendedStyle
}

export interface StyleIdentifier {
  styleGuide: string
  style?: string
}

export interface StyleCreateAction {
  action: 'create'
  identifier: StyleIdentifier
  fields: ExtendedStyle
}

export interface StyleUpdateAction {
  action: 'update'
  identifier: StyleIdentifier
  fields: ExtendedStyle
}

export interface StyleDeleteAction {
  action: 'delete'
  identifier: StyleIdentifier
}

// --------- AliasTokens ------------

export type AliasTokenFormAction = CloseAction | OpenAction | RescanAction

export type AliasTokenIntegrationAction = AliasTokenFormAction & {
  controller: 'aliasToken'
  identifier?: string
  fields?: { selected: string[] }
}

export type AliasTokenIntegration = AliasTokenFormData & {
  form: 'aliasToken'
}

export interface AliasTokenFormData {
  identifier: string
  aliasTokens: string[]
  fields?: { selected: string[] }
}

export interface AliasTokenReturnFields {
  selected: string[]
}

export interface RescanAction {
  action: 'rescan'
}

// --------- Theme ------------
export type ThemeIntegration = ThemeFormData & {
  form: 'theme'
}

export interface ThemeFormData {
  identifier?: string
  styleGuides: KeyValues
  fields?: { name: string; styleGuide: string }
}

export type ThemeFormAction =
  | OpenAction
  | CloseAction
  | ThemeCreateAction
  | ThemeUpdateAction
  | ThemeDeleteAction
  | ThemeDuplicateAction

export type ThemeIntegrationAction = ThemeFormAction & {
  controller: 'theme'
  identifier?: string
  fields?: { name: string; styleGuide: string }
}

export interface ThemeCreateAction {
  action: 'create'
  fields: { name: string; styleGuide: string }
}

export interface ThemeUpdateAction {
  action: 'update'
  identifier: string
  fields: { name: string; styleGuide: string }
}

export interface ThemeDuplicateAction {
  controller: 'theme'
  action: 'duplicate'
  identifier: string
  fields: { name: string }
}

export interface ThemeDeleteAction {
  action: 'delete'
  identifier: string
}

// --------- DesignToken ------------
export type DesignTokenIntegration = (DesignTokenFormData | DesignTokenSplitFormData) & {
  form: 'designToken'
}

export interface DesignTokenFormData {
  identifier?: string
  fields?: DesignTokenFormFields
  groups: string[]
  propertyTypes: KeyValues
}

export interface DesignTokenSplitFormData {
  identifier?: string
  aliasTokens: string[]
  fields?: DesignTokenSplitFormFields
  groups: string[]
  propertyTypes: KeyValues
}

export interface DesignTokenFormFields {
  name: string
  group: string
  type: string
  description: string
}

export interface DesignTokenSplitFormFields {
  name: string
  description: string
  selected: string[]
}

export type DesignTokenFormAction =
  | OpenAction
  | CloseAction
  | DesignTokenCreateAction
  | DesignTokenUpdateAction
  | DesignTokenDeleteAction
  | DesignTokenAliasTokensAction
  | DesignTokenSplitAction

export type DesignTokenIntegrationAction = DesignTokenFormAction & {
  controller: 'designToken'
  identifier?: string
  fields?: DesignTokenFormFields
}

export interface DesignTokenCreateAction {
  action: 'create'
  fields: DesignTokenFormFields
}

export interface DesignTokenUpdateAction {
  action: 'update'
  identifier: string
  fields: DesignTokenFormFields
}

export interface DesignTokenDeleteAction {
  action: 'delete'
  identifier: string
}

export interface DesignTokenAliasTokensAction {
  controller: 'designToken'
  action: 'updateAliasTokens'
  identifier: string
  fields: { selected: string[] }
}

export interface DesignTokenSplitAction {
  controller: 'designToken'
  action: 'split'
  identifier: string
  fields: DesignTokenSplitFormFields
}

// --------- ThemeValue ------------
export type ThemeValueIntegration = ThemeValueFormData & {
  form: 'themeValue'
}

export interface ThemeValueFormData {
  identifier?: ThemeValueIdentifier
  fields?: ThemeValueFormFields
  styles: StyleMap
  type: string
  medias: KeyValues
}

export interface ThemeValueFormFields {
  media: string
  direct?: string
  style?: string
}

export interface ThemeValueReturnFields {
  media: string
  style?: string
  direct?: DirectValue
}

export type ThemeValueFormAction =
  | OpenAction
  | CloseAction
  | ThemeValueCreateAction
  | ThemeValueUpdateAction
  | ThemeValueDeleteAction

export type ThemeValueIntegrationAction = ThemeValueFormAction & {
  controller: 'themeValue'
  identifier?: ThemeValueIdentifier
  fields?: ThemeValueReturnFields | string
}

export interface ThemeValueIdentifier {
  designToken: string
  theme: string
  media?: string
}

export interface ThemeValueCreateAction {
  action: 'create'
  identifier: ThemeValueIdentifier
  fields: ThemeValueReturnFields
}

export interface ThemeValueUpdateAction {
  action: 'update'
  identifier: ThemeValueIdentifier
  fields: ThemeValueReturnFields
}

export interface ThemeValueDeleteAction {
  action: 'delete'
  identifier: ThemeValueIdentifier
}
