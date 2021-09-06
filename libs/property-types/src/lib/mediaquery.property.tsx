import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const mediaquery = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <pre>{value}</pre>
      </div>
    )
  },
}
