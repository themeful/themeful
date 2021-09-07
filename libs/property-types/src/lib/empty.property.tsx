import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const empty = {
  ...fallback,
  template: () => (
    <div class="property__value" style={{ paddingTop: '1rem' }}>
      empty
    </div>
  ),
}
