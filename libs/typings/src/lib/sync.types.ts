export type Callback = (data: SyncData) => void

export type Action = 'create' | 'update' | 'delete' | 'sync' | 'duplicate'

export type Scope = 'aliasTokens' | 'styleGuides' | 'designTokens' | 'styleGuideBases' | 'themes'

export type SyncStack = {
  [scope in Scope]?: Callback[]
}

export interface SyncData {
  action: Action
  primary?: string
  secondary?: string
  values?: string[]
}
