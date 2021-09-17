import { h } from '@stencil/core'

export default {
  title: 'Forms/Style Guide',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const styleGuide = (args) => {
  return (
    <div>
      <div class="header">
        <h1>Style Guide Form</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '600px' }}>
          <tf-style-guide-form {...args} />
        </div>
      </div>
    </div>
  )
}
