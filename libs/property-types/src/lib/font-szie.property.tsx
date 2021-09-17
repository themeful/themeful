import { h } from '@stencil/core'
import { fallback } from './fallback.property'
import { PropertyType } from '@typings'

export const fontSize: PropertyType = {
  ...fallback,
  name: 'Font Size',
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <span style={{ fontSize: value }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
