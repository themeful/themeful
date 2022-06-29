export type Components = Component[]

export interface Component {
  id: string
  name: string
  files: ComponentFile[]
  ignored: boolean
}

export interface ComponentFile {
  path: string
  ignored: boolean
}
