import { h } from '@stencil/core'

export default {
  title: 'Forms/Style Guide',
  args: {
    formData: {
      name: 'StyleGuide Name',
      baseFontSize: 16,
    },
  },
}

export const styleGuide = (args) => {
  return (
    <div>
      <div class="header">
        <h1>Style Guide Form</h1>
      </div>
      <div class="content" style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ position: 'relative', width: '600px' }}>
          <tf-style-guide-form {...args} />
        </div>
        <div class="tf-light" style={{ position: 'relative', width: '600px', background: '#fff' }}>
          <tf-style-guide-form {...args} />
        </div>
      </div>
    </div>
  )
}
