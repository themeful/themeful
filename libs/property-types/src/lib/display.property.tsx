import { h } from '@stencil/core'
import { fallback } from './fallback.property'
import { PropertyType } from '@typings'

export const display: PropertyType = {
  ...fallback,
  name: 'Display',
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <pre>display: {value};</pre>
      </div>
    )
  },
}
