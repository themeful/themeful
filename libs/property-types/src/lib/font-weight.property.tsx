import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const fontWeight: PropertyType = {
  ...fallback,
  name: 'Font Weight',
  template: (value): HTMLElement => {
    return (
      <div class="property__value tf_font-weight">
        <span style={{ fontWeight: value, fontSize: '1.5rem' }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
