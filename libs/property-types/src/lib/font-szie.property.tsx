import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const fontSize = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div>
        <pre>{value}</pre>
      </div>
    )
  },
}
