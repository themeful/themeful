export type Callback = (data: SyncData) => void

export type Action = 'create' | 'update' | 'delete' | 'sync'

export type Scope = 'aliasTokens' | 'sites' | 'designTokens' | 'baseValues'

export type SyncStack = {
  [scope in Scope]?: Callback[]
}

export interface SyncData {
  values: string[]
  action: Action
  primary?: string
  secondary?: string
}
