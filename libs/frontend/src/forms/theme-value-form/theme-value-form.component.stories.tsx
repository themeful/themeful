import { h } from '@stencil/core'

export default {
  title: 'Forms/Theme Value',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const themeValue = (args) => {
  return <tf-theme-value-form {...args}></tf-theme-value-form>
}
