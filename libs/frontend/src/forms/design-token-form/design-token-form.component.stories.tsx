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
  return (
    <div>
      <div class="header">
        <h1>Design Token Form</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '600px' }}>
          <tf-design-token-form {...args} />
        </div>
      </div>
    </div>
  )
}
