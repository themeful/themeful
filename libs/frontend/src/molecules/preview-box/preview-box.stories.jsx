import { h } from '@stencil/core'

export default {
  title: 'Molecules/Preview Box',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const previewBox = (args) => {
  return <preview-box {...args}></preview-box>
}
