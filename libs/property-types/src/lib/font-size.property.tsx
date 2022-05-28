import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const fontSize: PropertyType = {
  ...fallback,
  name: 'Font Size',
  template: (value): HTMLElement => {
    return (
      <div class="property__value tf_font-size">
        <span style={{ fontSize: value }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
