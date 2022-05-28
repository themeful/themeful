import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const font: PropertyType = {
  ...fallback,
  name: 'Font',
  template: (value): HTMLElement => {
    return (
      <div class="property__value tf_font">
        <span style={{ font: value }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
