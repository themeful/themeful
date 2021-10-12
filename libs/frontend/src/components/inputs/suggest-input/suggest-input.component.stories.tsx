import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Components/Inputs/Suggest Input',
  args: {
    samples: [
      {
        label: 'Without items',
      },
      {
        label: 'With items',
        items: ['First Value', 'Second Value'],
      },
      {
        label: 'Min Length',
        value: 'Some Value',
        items: ['First Value', 'Second Value'],
        'min-length': 10,
      },
      {
        label: 'Extra Validation',
        value: '123',
        items: ['First Value', 'Second Value'],
        validation: (value) => (Number(value) > 0 ? null : 'Please enter a number'),
      },
    ],
  },
}

export const suggestInput = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Suggest Input</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-suggest-input {...args} onInputChange={action('change')} />
            </div>
            <div>
              <tf-suggest-input {...args} onInputChange={action('change')} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
