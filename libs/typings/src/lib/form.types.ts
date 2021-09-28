import { ExtendedStyle, StyleGuideBase } from './style.types'

// Common
export type FormActions = StyleGuideFormAction | StyleFormAction
export type FormIntegrationActions = StyleGuideIntegrtionAction | StyleIntegrtionAction
export type FormIntegrations = StyleGuideIntegration | StyleIntegration

export interface FormValues {
  [key: string]: string | number
}

// Style Guide Form
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

// Style Form
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
