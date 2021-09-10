import { h } from '@stencil/core'
import { fallback } from './fallback.property'
import { PropertyType } from '@typings'

export const mediaquery: PropertyType = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <pre style={{ fontSize: '0.75rem' }}>{value}</pre>
      </div>
    )
  },
}
