export interface PropertyType {
  name: string
  validation: (value: string) => boolean
  template: (value: string) => HTMLElement
  sort: (a: string, b: string) => number
  styles: {
    name: { [key: string]: string }
    wrapper: { [key: string]: string }
  }
}
