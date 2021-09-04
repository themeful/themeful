import { h } from '@stencil/core'

export const color = {
  validation: (value) => !!value,
  template: ({value, name}): HTMLElement => {
    const formated = value.replace('rgba(', '').replace(')', '')
    return (
      <div>
        <label>{name}</label>
        <pre>{formated}</pre>
      </div>
    )
    },
  sort: (a, b) => a > b ? 1 : -1
}