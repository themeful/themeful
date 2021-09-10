export interface Property {
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
  nameStyles: { [key: string]: string }
  wrapperStyles: { [key: string]: string }
}
