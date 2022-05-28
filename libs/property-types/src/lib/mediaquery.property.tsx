import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const mediaquery: PropertyType = {
  ...fallback,
  name: 'MediaQuery',
  template: (value): HTMLElement => {
    return (
      <div class="property__value tf_mediaquery">
        <pre style={{ fontSize: '0.75rem' }}>{value}</pre>
      </div>
    )
  },
}
