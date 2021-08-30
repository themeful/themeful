import { h } from '@stencil/core'
import { TfOverlay } from './overlay.component'

export default {
  title: 'Overlay',
  component: TfOverlay,
}

export const overlay = (): JSX.Element => {
  return <tf-overlay>Some content</tf-overlay>
}
