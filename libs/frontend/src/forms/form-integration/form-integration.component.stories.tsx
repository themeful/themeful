/* eslint-disable react/jsx-no-bind */
import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import { Subject } from 'rxjs'

const triggerOverlay = new Subject()
const openOverlay = (form) => {
  triggerOverlay.next(formDatas[form])
}

const formDatas = {
  styleguide: {
    form: 'styleguide',
    identifier: 'styleGuide1',
    fields: {
      name: 'StyleGuide Name',
      baseFontSize: 16,
    },
  },
  empty: {
    form: 'empty',
    identifier: 'styleGuide1',
    fields: {
      name: 'StyleGuide Name',
      baseFontSize: 16,
    },
  },
}

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
        <div style={{ width: '80%', display: 'flex', gap: '16px' }}>
          <tf-button onClick={() => openOverlay('styleguide')}>Open Style Guide Form</tf-button>
          <tf-button onClick={() => openOverlay('empty')}>Open Empty</tf-button>
        </div>
        <tf-form-integration {...args} />
      </div>
    </div>
  )
}

formIntegration.args = {
  formData$: triggerOverlay,
  onAction: action('triggered action'),
}
