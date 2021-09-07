import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const fontFamily = {
  ...fallback,
  template: (value): HTMLElement => {
    const valueStyles = { padding: '0.5rem 1rem 1rem' }
    const styles = { fontFamily: value, fontSize: '1.5rem', textAlign: 'center' }
    return (
      <div class="property__value" style={valueStyles}>
        <span style={styles}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
