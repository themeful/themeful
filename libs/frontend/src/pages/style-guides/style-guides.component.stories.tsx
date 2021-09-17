import { h } from '@stencil/core'

export default {
  title: 'Pages/Style Guides',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const styleGuides = (args) => {
  return <tf-style-guides {...args}></tf-style-guides>
}
