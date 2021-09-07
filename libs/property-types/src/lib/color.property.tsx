import { h } from '@stencil/core'
import { toHEX, toRGBA } from '@utils'
import { fallback } from './fallback.property'

export const color = {
  ...fallback,
  template: (value): HTMLElement => {
    const formated = value.replace('rgba(', '').replace(')', '')
    const styles = {
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '50%',
      right: '0',
      background: '#fff',
      zIndex: '-1',
    }
    return (
      <div
        class="property__value"
        style={{
          background: `linear-gradient(0deg, ${toHEX(value)} 50%, ${toRGBA(value)} 50%)`,
        }}
      >
        <div style={styles}></div>
        <pre style={{ backgroundColor: 'rgba(100, 100, 100, 0.7)', color: '#eee' }}>{formated}</pre>
      </div>
    )
  },
  nameStyles: { backgroundColor: 'rgba(100, 100, 100, 0.7)', color: '#eee' },
  wrapperStyles: {
    background: 'repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 50% / 10px 10px',
    zIndex: 0,
  },
}
