import { h } from '@stencil/core'
import { fallback } from './fallback.property'
import { PropertyType } from '@typings'

export const empty: PropertyType = {
  ...fallback,
  name: 'Empty',
  template: () => (
    <div class="property__value" style={{ paddingTop: '1rem' }}>
      empty
    </div>
  ),
}
