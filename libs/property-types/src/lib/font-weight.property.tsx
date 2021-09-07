import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const fontWeight = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <span style={{ fontWeight: value, fontSize: '1.5rem' }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
