export type Callback = (data: SyncData) => void

export type Action = 'create' | 'update' | 'delete' | 'sync'

export type Scope = 'aliasTokens' | 'styleGuides' | 'designTokens' | 'styleGuideBases'

export type SyncStack = {
  [scope in Scope]?: Callback[]
}

export interface SyncData {
  values: string[]
  action: Action
  primary?: string
  secondary?: string
}
