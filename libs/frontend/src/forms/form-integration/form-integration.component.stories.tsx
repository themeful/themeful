import { h } from '@stencil/core'

export default {
  title: 'Forms/Form Integration',
}

export const formIntegration = (args) => {
  return (
    <div>
      <div class="header">
        <h1>Form Integration</h1>
      </div>
      <div class="content">
        <div style={{ width: '600px' }}>
          <tf-form-integration {...args}></tf-form-integration>
        </div>
      </div>
    </div>
  )
}

formIntegration.args = {
  show: true,
  formData: {
    styleGuide: 'styleGuide1',
    fields: {
      name: 'StyleGuide Name',
      baseFontSize: 16,
    },
  },
}
