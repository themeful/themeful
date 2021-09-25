import { h } from '@stencil/core'

export default {
  title: 'Microfrontend/Themeful',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const themeful = (args) => {
  return <themeful-microfrontend {...args}></themeful-microfrontend>
}
