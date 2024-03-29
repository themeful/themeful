import { AliasTokens } from './aliasToken.types'
import { Components } from './component.types'
import { DesignTokens } from './designToken.types'
import { StyleGuides } from './style.types'
import { Themes } from './theme.types'

export type Callback = (data: SyncData) => void

export type Action = 'create' | 'update' | 'delete' | 'sync' | 'duplicate' | 'split'

export type Scope = 'aliasTokens' | 'styleGuides' | 'designTokens' | 'styleGuideBases' | 'themes'

export type Data = AliasTokens | DesignTokens | StyleGuides | Themes | Components

export type SyncStack = {
  [scope in Scope]?: Callback[]
}

export interface SyncData {
  action: Action
  primary?: string
  secondary?: string
  values?: string[]
}
