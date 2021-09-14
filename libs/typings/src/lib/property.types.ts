export interface PropertyValue {
  name: string
  global?: boolean
  group: string
  type: string
  value: string
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
