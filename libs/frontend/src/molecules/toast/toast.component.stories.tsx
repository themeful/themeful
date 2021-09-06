import { h } from '@stencil/core'

export default {
  title: 'Molecules/Toast',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const toast = (args): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Toast</h1>
      </div>
      <div class="content">
        <tf-toast {...args}></tf-toast>
      </div>
    </div>
  )
}
