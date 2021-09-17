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
  return (
    <div>
      <div class="header">
        <h1>Style Form</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '600px' }}>
          <tf-style-form {...args}></tf-style-form>
        </div>
      </div>
    </div>
  )
}
