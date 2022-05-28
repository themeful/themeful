import { h } from '@stencil/core'
import { PropertyType } from '@typings'
import { fallback } from './fallback.property'

export const empty: PropertyType = {
  ...fallback,
  name: 'Empty',
  template: () => (
    <div class="property__value tf_empty" style={{ paddingTop: '1rem' }}>
      empty
    </div>
  ),
}
