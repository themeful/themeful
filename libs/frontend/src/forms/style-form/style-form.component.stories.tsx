import { h } from '@stencil/core'

export default {
  title: 'Forms/Style',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const style = (args) => {
  return <tf-style-form {...args}></tf-style-form>
}
