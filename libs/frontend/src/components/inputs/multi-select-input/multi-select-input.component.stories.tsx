import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Components/Inputs/Multi Select Input',
  args: {
    samples: [
      {
        label: 'Nothing selected',
        items: ['First Value', 'Second Value', 'Third Value', 'Fourth Value'],
        onInputChange: action('change'),
      },
      {
        label: 'First',
        value: ['Second Value', 'Fourth Value'],
        items: ['First Value', 'Third Value'],
        onInputChange: action('change'),
      },
      {
        label: 'Required',
        required: true,
        value: ['Fourth Value'],
        items: ['First Value', 'Second Value', 'Third Value'],
        onInputChange: action('change'),
      },
    ],
  },
}

export const multiSelectInput = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Multi Select Input</h1>
      </div>
      <div
        class="content"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          // gridAutoRows: '100px',
        }}
      >
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
              <tf-multi-select-input {...args} />
            </div>
            <div style={{ padding: '1rem' }}>
              <tf-multi-select-input {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
