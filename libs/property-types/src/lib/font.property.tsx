import { h } from '@stencil/core'
import { fallback } from './fallback.property'

export const font = {
  ...fallback,
  template: (value): HTMLElement => {
    const valueStyles = { paddingTop: '0.5rem' }
    const styles = { font: value, fontSize: '1.5rem' }
    return (
      <div class="property__value" style={valueStyles}>
        <span style={styles}>Aa</span>
        <pre>{value}</pre>
      </div>
    )
  },
}
