import { h } from '@stencil/core'
import { fallback } from './fallback.property'
import { PropertyType } from '@typings'

export const fontWeight: PropertyType = {
  ...fallback,
  name: 'Font Weight',
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <span style={{ fontWeight: value, fontSize: '1.5rem' }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
