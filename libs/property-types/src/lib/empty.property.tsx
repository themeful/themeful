import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const empty = {
  ...fallback,
  template: () => <div>empty</div>,
}
