import { h } from '@stencil/core'
import { PropertyType } from '@typings'

export const fallback: PropertyType = {
  name: 'Fallback',
  validation: (value) => !!value,
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <pre>{value}</pre>
      </div>
    )
  },
  sort: (a, b) => (a > b ? 1 : -1),
  styles: {
    name: {},
    wrapper: {},
  },
}
