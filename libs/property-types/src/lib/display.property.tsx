import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const display = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <pre>display: {value};</pre>
      </div>
    )
  },
}
