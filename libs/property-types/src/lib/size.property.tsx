import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const size: PropertyType = {
  ...fallback,
  name: 'Size',
  template: (value): HTMLElement => {
    return (
      <div class="property__value tf_size">
        <div
          style={{
            border: '1px dashed currentColor',
            backgroundColor: 'hsl(213,73%,63%)',
            height: value,
            width: value,
          }}
        ></div>
        <pre>{value}</pre>
      </div>
    )
  },
}
