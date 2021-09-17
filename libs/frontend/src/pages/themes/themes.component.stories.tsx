import { h } from '@stencil/core'

export default {
  title: 'Pages/Themes',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const themes = (args) => {
  return <tf-themes {...args}></tf-themes>
}
