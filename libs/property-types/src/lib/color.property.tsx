import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const color = {
  ...fallback,
  template: (value): HTMLElement => {
    const formated = value.replace('rgba(', '').replace(')', '')
    const styles = { background: value }
    const preStyles = { background: '#aaa' }
    return (
      <div class="property__value" style={styles}>
        <pre style={preStyles}>{formated}</pre>
      </div>
    )
  },
}
