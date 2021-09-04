import { h } from '@stencil/core'

export const color = {
  validation: () => true,
  template: (name) => <div>Color Box {name}</div>,
  sort: (a, b) => a > b ? 1 : -1
}