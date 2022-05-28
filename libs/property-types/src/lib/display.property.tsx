import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const display: PropertyType = {
  ...fallback,
  name: 'Display',
  template: (value): HTMLElement => {
    return (
      <div class="property__value tf_display">
        <pre>display: {value};</pre>
      </div>
    )
  },
}
