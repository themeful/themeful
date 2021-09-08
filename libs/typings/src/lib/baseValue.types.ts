export interface BaseValue {
  key?: string
  type: string
  group: string
  name: string
  value: string
  global?: boolean
}

export interface BaseClient {
  name: string
  client: string
  baseFontSize: number
  values: { [key: string]: BaseValue }
}

export interface BaseValues {
  global: { [key: string]: BaseValue }
  clients: { [key: string]: BaseClient }
}

export type InternalGroups = { [key: string]: BaseValue[] }
export type InternalBaseValues = { [key: string]: BaseValue }

export interface BaseValueSection {
  name: string
  slug: string
  baseFontSize: number
  types: BaseValueType[]
}

export interface BaseValueGroup {
  name: string
  values: BaseValue[]
}

export interface BaseValueType {
  name: string
  groups: BaseValueGroup[]
  noGroupTitle: boolean
}
