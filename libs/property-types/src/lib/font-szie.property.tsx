import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const fontSize = {
  ...fallback,
  template: ({ value, name }): HTMLElement => {
    return (
      <div>
        <label>{name}</label>
        <pre>{value}</pre>
      </div>
    )
  },
}
