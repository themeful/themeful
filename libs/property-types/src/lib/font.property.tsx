import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const font: PropertyType = {
  ...fallback,
  name: 'Font',
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <span style={{ font: value, fontSize: '1.5rem' }}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
