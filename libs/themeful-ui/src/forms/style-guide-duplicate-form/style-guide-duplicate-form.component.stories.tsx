import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Forms/Style Guide Duplicate',
  args: {
    samples: [
      {
        formData: {
          identifier: 'global',
          fields: {
            name: 'Global',
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: 'styleGuide1',
          fields: {
            name: 'StyleGuide 1',
          },
        },
        onAction: action('triggered action'),
      },
    ],
  },
}

export const styleGuideDuplicate = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Style Guide Duplicate Form</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-style-guide-duplicate-form {...args} />
            </div>
            <div>
              <tf-style-guide-duplicate-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
