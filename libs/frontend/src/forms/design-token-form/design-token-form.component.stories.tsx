import { h } from '@stencil/core'

export default {
  title: 'Forms/Design Token',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const designToken = (args) => {
  return <tf-design-token-form {...args}></tf-design-token-form>
}
