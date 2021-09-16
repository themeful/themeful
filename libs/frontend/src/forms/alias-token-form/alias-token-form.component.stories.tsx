import { h } from '@stencil/core'

export default {
  title: 'Forms/Alias Token',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const aliasToken = (args) => {
  return <tf-alias-token-select {...args}></tf-alias-token-select>
}
