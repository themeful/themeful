import { h } from '@stencil/core'

export default {
  title: 'Molecules/Preview Box',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const previewBox = (args): HTMLElement => {
  return (
  <div>
    <tf-preview-box type='color'></tf-preview-box>
    <tf-preview-box type='font'></tf-preview-box>
    <tf-preview-box></tf-preview-box>
  </div>)
}
