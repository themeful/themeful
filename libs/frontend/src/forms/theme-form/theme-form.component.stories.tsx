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
  return (
    <div>
      <div class="header">
        <h1>Theme Form</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '600px' }}>
          <tf-theme-form {...args} />
        </div>
      </div>
    </div>
  )
}
