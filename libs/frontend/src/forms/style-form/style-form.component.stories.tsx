import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

const groups = ['First Group', 'Second Group', 'Third Group']
const propertyTypes = [
  { key: 'color', value: 'Color' },
  { key: 'font-size', value: 'Font Size' },
  { key: 'mediaquery', value: 'MediaQuery' },
]

export default {
  title: 'Forms/Style',
  args: {
    samples: [
      {
        formData: {
          groups: groups,
          propertyTypes: propertyTypes,
          fields: {
            type: 'color',
            group: 'Base Group',
            name: 'Red',
            value: '#4b83be',
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: { styleguide: 'styleGuide1', style: 'baseGroup_red' },
          groups: groups,
          propertyTypes: [{ key: '', value: '-' }, ...propertyTypes],
          fields: {
            type: 'font-size',
            group: 'Base Group',
            name: 'Small',
            value: '16px',
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

export const style = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Style Form</h1>
      </div>
      <div
        class="content"
        style={{
          display: 'grid',
          gridTemplateColumns: '500px 500px',
          gridAutoRows: 'minmax(300px, min-content)',
          gap: '1rem',
        }}
      >
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
              <tf-style-form {...args} />
            </div>
            <div style={{ padding: '1rem' }}>
              <tf-style-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
