import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Forms/Design Token Split',
  args: {
    samples: [
      {
        formData: {
          identifier: 'dtActionBg',
          aliasTokens: ['atCardBackground', 'atButtonBackground'],
          fields: {
            name: 'Some Token Name',
            group: 'Base',
            type: 'color',
            description: 'Some good description',
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: 'dtActionBg',
          aliasTokens: ['atCardBackground'],
          fields: {
            name: 'Some Token Name',
            group: 'Base',
            type: 'color',
            description: 'Some good description',
            selected: ['atButtonBackground'],
          },
        },
        onAction: action('triggered action'),
      },
    ],
  },
}

export const designTokenSplit = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>DesignToken Split Form</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-design-token-split-form {...args} />
            </div>
            <div>
              <tf-design-token-split-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
