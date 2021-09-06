import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const color = {
  ...fallback,
  template: ({ value, name }): HTMLElement => {
    const formated = value.replace('rgba(', '').replace(')', '')
    return (
      <div>
        <label>{name}</label>
        <pre>{formated}</pre>
      </div>
    )
  },
}
