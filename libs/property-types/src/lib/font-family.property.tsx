import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const fontFamily = {
  ...fallback,
  template: (value): HTMLElement => {
    return (
      <div>
        <pre>{value}</pre>
      </div>
    )
  },
}
