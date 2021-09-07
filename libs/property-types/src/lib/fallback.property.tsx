import { h } from '@stencil/core'

export const fallback = {
  validation: (value) => !!value,
  template: (value): HTMLElement => {
    return (
      <div class="property__value">
        <pre>{value}</pre>
      </div>
    )
  },
  sort: (a, b) => (a > b ? 1 : -1),
  nameStyles: {},
  wrapperStyles: {},
}
