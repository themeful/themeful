import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const fontWeight = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div>
        <pre>{value}</pre>
      </div>
    )
  },
}
