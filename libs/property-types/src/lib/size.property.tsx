import { h } from '@stencil/core'
import { fallback } from './fallback.property'
import { PropertyType } from '@typings'

export const size: PropertyType = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <div
          style={{
            border: '1px dashed rgba(17, 0, 255, 0.479)',
            backgroundColor: '#7496f1',
            height: value,
            width: value,
          }}
        ></div>
        <pre>{value}</pre>
      </div>
    )
  },
}
