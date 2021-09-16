import { h } from '@stencil/core'

export default {
  title: 'Forms/Theme',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const theme = (args) => {
  return <tf-theme-form {...args}></tf-theme-form>
}
