import { h } from '@stencil/core'

export default {
  title: 'Molecules/Toast',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const toast = (args) => {
  return <tf-toast {...args}></tf-toast>
}
