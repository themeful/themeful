import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const fontFamily: PropertyType = {
  ...fallback,
  name: 'Font Family',
  template: (value): HTMLElement => {
    return (
      <div class="property__value  tf_font-family">
        <span style={{ fontFamily: value, fontSize: '1.5rem' }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
