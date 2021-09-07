import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const color = {
  ...fallback,
  template: (value): HTMLElement => {
    const formated = value.replace('rgba(', '').replace(')', '')
    const styles = { background: value }
    const preStyles = { backgroundColor: 'rgba(100, 100, 100, 0.7)', color: '#fff' }
    return (
      <div class="property__value" style={styles}>
        <pre style={preStyles}>{formated}</pre>
      </div>
    )
  },
  nameStyles: { backgroundColor: 'rgba(100, 100, 100, 0.7)', color: '#fff' },
}
