import { ExtendedStyle, StyleGuideBase } from './style.types'

// --------- Common ------------
export type FormActions =
  | StyleGuideFormAction
  | StyleFormAction
  | ThemeFormAction
  | DesignTokenFormAction
  | AliasTokenFormAction

export type FormIntegrationActions =
  | StyleGuideIntegrtionAction
  | StyleIntegrtionAction
  | ThemeIntegrtionAction
  | DesignTokenIntegrtionAction
  | AliasTokenIntegrtionAction

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
  | CloseAction
  | StyleGuideCreateAction
  | StyleGuideUpdateAction
  | StyleGuideDeleteAction

export type StyleGuideIntegrtionAction = StyleGuideFormAction & {
  controller: 'styleguide'
}

export interface CloseAction {
  action: 'close'
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
  propertyTypes: { key: string; value: string }[]
}

export type StyleFormAction =
  | CloseAction
  | StyleCreateAction
  | StyleUpdateAction
  | StyleDeleteAction

export type StyleIntegrtionAction = StyleFormAction & {
  controller: 'style'
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

export type AliasTokenFormAction = RescanAction | AliasTokenUpdateAction

export type AliasTokenIntegrtionAction = AliasTokenFormAction & {
  controller: 'aliasToken'
}

export type AliasTokenIntegration = AliasTokenFormData & {
  form: 'aliasToken'
}

export interface AliasTokenFormData {
  identifier?: string
  aliasTokens: string[]
  fields?: { selected: string[] }
}

export interface AliasTokenUpdateAction {
  action: 'update'
  identifier: string
  fields: { selected: string[] }
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
  fields?: { name: string; styleGuide: string }
}

export type ThemeFormAction =
  | CloseAction
  | ThemeCreateAction
  | ThemeUpdateAction
  | ThemeDeleteAction

export type ThemeIntegrtionAction = ThemeFormAction & {
  controller: 'theme'
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

export interface ThemeDeleteAction {
  action: 'delete'
  identifier: string
}

// --------- DesignToken ------------
export type DesignTokenIntegration = DesignTokenFormData & {
  form: 'designToken'
}

export interface DesignTokenFormData {
  identifier?: string
  fields?: DesignTokenFormFields
  groups: string[]
  propertyTypes: { key: string; value: string }[]
}

export interface DesignTokenFormFields {
  name: string
  group: string
  type: string
  description: string
}

export type DesignTokenFormAction =
  | CloseAction
  | DesignTokenCreateAction
  | DesignTokenUpdateAction
  | DesignTokenDeleteAction

export type DesignTokenIntegrtionAction = DesignTokenFormAction & {
  controller: 'designToken'
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
