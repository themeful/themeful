import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Components/Inputs/Color Input',
  args: {
    samples: [
      {
        label: 'Empty',
        required: true,
      },
      {
        label: 'HEX',
        value: '#d920c1',
        required: true,
      },
      {
        label: 'RGBA',
        value: 'rgba(45,79,39,0.76)',
      },
      {
        label: 'Invalid',
        value: 'hsl(100,',
      },
    ],
  },
}

export const colorInput = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Color Input</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-color-input {...args} onInputChange={action('change')} />
            </div>
            <div>
              <tf-color-input {...args} onInputChange={action('change')} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
