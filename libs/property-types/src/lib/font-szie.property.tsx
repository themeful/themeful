import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const fontSize = {
  ...fallback,
  template: (value): HTMLElement => {
    const valueStyles = { paddingTop: '0.5rem' }
    const styles = { fontSize: value }
    return (
      <div class="property__value" style={valueStyles}>
        <span style={styles}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
