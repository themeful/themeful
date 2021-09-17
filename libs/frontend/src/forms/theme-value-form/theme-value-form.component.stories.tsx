import { h } from '@stencil/core'

export default {
  title: 'Forms/Theme Value',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const themeValue = (args) => {
  return (
    <div>
      <div class="header">
        <h1>Theme Value Form</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '600px' }}>
          <tf-theme-value-form {...args}></tf-theme-value-form>
        </div>
      </div>
    </div>
  )
}
