import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Forms/Theme Duplicate',
  args: {
    samples: [
      {
        formData: {
          fields: {
            name: 'Dark',
            styleGuide: 'styleGuide1',
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: 'styleGuide1_dark',
          fields: {
            name: 'Dark',
            styleGuide: 'styleGuide1',
          },
        },
        onAction: action('triggered action'),
      },
    ],
  },
}

export const themeDuplicate = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Theme Duplicate Form</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-theme-duplicate-form {...args} />
            </div>
            <div>
              <tf-theme-duplicate-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
