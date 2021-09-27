import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Components/Select Input',
  args: {
    samples: [
      {
        label: 'Empty',
      },
      {
        label: 'With Test',
        value: 'My Text',
      },
      {
        label: 'Min Length',
        'min-length': 10,
      },
      {
        label: 'Extra Validation',
        value: '123',
        validation: (value) => (Number(value) > 0 ? null : 'Please enter a number'),
      },
    ],
  },
}

export const selectInput = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Select Input</h1>
      </div>
      <div
        class="content"
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 300px',
          gridAutoRows: '100px',
        }}
      >
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
              <tf-select-input {...args} onInputChange={action('change')} />
            </div>
            <div style={{ padding: '1rem' }}>
              <tf-select-input {...args} onInputChange={action('change')} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
