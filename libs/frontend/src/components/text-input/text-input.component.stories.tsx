import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Components/Text Input',
  args: {
    args: {
      type: 'text',
      label: 'the label',
      value: 'My Text',
    },
    validation: (value) => (Number(value) > 0 ? null : 'Please enter a number'),
  },
}

export const textInput = ({ args, validation }) => {
  return (
    <div>
      <div class="header">
        <h1>Alias Token Form</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '300px', padding: '16px' }}>
          <tf-text-input {...args} onInputChange={action('change')} />
        </div>
        <div
          class="tf-light"
          style={{ position: 'relative', width: '300px', background: '#fff', padding: '16px' }}
        >
          <tf-text-input {...args} onInputChange={action('change')} />
        </div>
        <div style={{ position: 'relative', width: '300px', padding: '16px' }}>
          <tf-text-input {...args} min-length="10" onInputChange={action('change')} />
        </div>
        <div style={{ position: 'relative', width: '300px', padding: '16px' }}>
          <tf-text-input {...args} validation={validation} onInputChange={action('change')} />
        </div>
      </div>
    </div>
  )
}
