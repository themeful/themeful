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
  return <tf-preview-box {...args}></tf-preview-box>
}
