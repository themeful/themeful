import { h } from '@stencil/core'

export const fallback = {
  validation: (value) => !!value,
  template: (value): HTMLElement => {
    return (
      <div>
        <pre>{value}</pre>
      </div>
    )
  },
  sort: (a, b) => (a > b ? 1 : -1),
}
