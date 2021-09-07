import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const fontSize = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <span style={{ fontSize: value }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
