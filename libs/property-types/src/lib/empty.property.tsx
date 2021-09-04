import { h } from '@stencil/core'

export const empty = {
  validation: (value) => !!value,
  template: () => <div>empty</div>,
  sort: (a, b) => a > b ? 1 : -1
}