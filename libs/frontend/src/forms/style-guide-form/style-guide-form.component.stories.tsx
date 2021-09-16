import { h } from '@stencil/core'

export default {
  title: 'Forms/Style Guide',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const styleGuide = (args) => {
  return <tf-style-guide-form {...args} />
}
