import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Components/Inputs/Select Input',
  args: {
    samples: [
      {
        label: 'Nothing selected',
        items: [
          { key: '', value: '-' },
          { key: 'first', value: 'First Value' },
          { key: 'second', value: 'Second Value' },
        ],
        onInputChange: action('change'),
      },
      {
        label: 'First',
        items: [
          { key: 'first', value: 'First Value' },
          { key: 'second', value: 'Second Value' },
        ],
        onInputChange: action('change'),
      },
      {
        label: 'Required',
        required: true,
        items: [
          { key: '', value: '-' },
          { key: 'first', value: 'First Value' },
          { key: 'second', value: 'Second Value' },
        ],
        onInputChange: action('change'),
      },
      {
        label: 'Extra Validation',
        value: 'second',
        items: [
          { key: 'first', value: 'First Value' },
          { key: 'second', value: 'Second Value' },
        ],
        onInputChange: action('change'),
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
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-select-input {...args} />
            </div>
            <div>
              <tf-select-input {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
