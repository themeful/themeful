export interface PropertyValue {
  value: string
  type: string
  name?: string
  group?: string
  global?: boolean
}

export interface PropertyType {
  validation: (value: string) => boolean
  template: (value: string) => HTMLElement
  sort: (a: string, b: string) => number
  styles: {
    name: { [key: string]: string }
    wrapper: { [key: string]: string }
  }
}
