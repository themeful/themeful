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
  return (
    <div>
      <div class="header">
        <h1>Alias Token Form</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '600px' }}>
          <tf-alias-token-form {...args}></tf-alias-token-form>
        </div>
      </div>
    </div>
  )
}
