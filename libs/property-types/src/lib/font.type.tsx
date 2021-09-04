import { h } from '@stencil/core'

export const font = {
  validation: () => true,
  template: (name) => <div>Font Box {name}</div>,
  sort: (a, b) => a > b ? 1 : -1
}