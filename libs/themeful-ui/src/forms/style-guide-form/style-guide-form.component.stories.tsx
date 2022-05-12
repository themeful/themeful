import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Forms/Style Guide',
  args: {
    samples: [
      {
        formData: {
          fields: {
            baseFontSize: 16,
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: 'styleGuide1',
          fields: {
            name: 'StyleGuide Name',
            baseFontSize: 16,
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {},
        onAction: action('triggered action'),
      },
    ],
  },
}

export const styleGuide = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Style Guide Form</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-style-guide-form {...args} />
            </div>
            <div>
              <tf-style-guide-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
