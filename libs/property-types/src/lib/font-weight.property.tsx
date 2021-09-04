import { h } from '@stencil/core'

export const fontWeight = {
  validation: (value) => !!value,
  template: ({value, name}): HTMLElement => {
    return (
      <div>
        <label>{name}</label>
        <pre>{value}</pre>
      </div>
    )
    },
  sort: (a, b) => a > b ? 1 : -1
}