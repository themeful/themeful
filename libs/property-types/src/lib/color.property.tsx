import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const color = {
  ...fallback,
  template: (value): HTMLElement => {
    const formated = value.replace('rgba(', '').replace(')', '')
    return (
      <div>
        <pre>{formated}</pre>
      </div>
    )
  },
}
