import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Components/Inputs/Text Input',
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

export const textInput = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Text Input</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-text-input {...args} onInputChange={action('change')} />
            </div>
            <div>
              <tf-text-input {...args} onInputChange={action('change')} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
