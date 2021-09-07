import { h } from '@stencil/core'
import { toHEX, toRGBA } from '@utils'
import { fallback } from './fallback.property'

export const color = {
  ...fallback,
  template: (value): HTMLElement => {
    const formated = value.replace('rgba(', '').replace(')', '')
    const styles = {
      background: `linear-gradient(90deg, ${toHEX(value)} 50%, ${toRGBA(value)} 50%)`,
    }
    const preStyles = { backgroundColor: 'rgba(100, 100, 100, 0.7)', color: '#fff' }
    return (
      <div class="property__value" style={styles}>
        <pre style={preStyles}>{formated}</pre>
      </div>
    )
  },
  nameStyles: { backgroundColor: 'rgba(100, 100, 100, 0.7)', color: '#fff' },
  wrapperStyles: {
    backgroundColor: 'repeating-conic-gradient(#aaa 0% 25%, transparent 0% 50%) 50% / 10px 10px',
  },
}
