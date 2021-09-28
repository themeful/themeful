import { StyleGuideBase } from '@typings'

export interface FormValues {
  [key: string]: string | number
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
