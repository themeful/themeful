export interface Components {
  [id: string]: Component
}

export interface Component {
  name: string
  files: ComponentFile[]
  ignored: boolean
}

export interface ComponentFile {
  path: string
  ignored: boolean
}
