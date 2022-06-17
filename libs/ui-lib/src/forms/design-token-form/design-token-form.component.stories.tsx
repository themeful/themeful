import { propertySelect } from '@properties'
import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Forms/Design Token',
  args: {
    samples: [
      {
        formData: {
          groups: ['Base', 'Content', 'More'],
          propertyTypes: propertySelect,
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
          identifier: 'dtSomeTokenName',
          groups: ['Base', 'Content', 'More'],
          propertyTypes: propertySelect,
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
          groups: ['Base', 'Content', 'More'],
          propertyTypes: propertySelect,
        },
        onAction: action('triggered action'),
      },
    ],
  },
}

export const designToken = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Design Token Form</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-design-token-form {...args} />
            </div>
            <div>
              <tf-design-token-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
