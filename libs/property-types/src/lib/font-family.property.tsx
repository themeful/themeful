import { h } from '@stencil/core'
import { fallback } from './fallback.property'
import { PropertyType } from '@typings'

export const fontFamily: PropertyType = {
  ...fallback,
  name: 'Font Family',
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <span style={{ fontFamily: value, fontSize: '1.5rem' }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
