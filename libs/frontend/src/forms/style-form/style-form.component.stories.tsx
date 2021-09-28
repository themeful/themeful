import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

const groups = ['First Group', 'Second Group', 'Third Group']
const propertyTypes = [
  { key: 'color', value: 'Color' },
  { key: 'font-size', value: 'Font Size' },
  { key: 'mediaquery', value: 'MediaQuery' },
]

export default {
  title: 'Forms/Style',
  args: {
    newMode: {
      formData: {
        groups: groups,
        propertyTypes: propertyTypes,
        fields: {
          type: 'color',
          group: 'Base Group',
          name: 'Red',
          value: '#ff0000',
        },
      },
      onAction: action('triggered action'),
    },
    editMode: {
      formData: {
        identifier: { styleguide: 'styleGuide1', style: 'baseGroup_red' },
        groups: groups,
        propertyTypes: [{ key: '', value: '-' }, ...propertyTypes],
        fields: {
          type: 'color',
          group: 'Base Group',
          name: 'Red',
          value: '#ff0000',
        },
      },
      onAction: action('triggered action'),
    },
    empty: {
      formData: {},
      onAction: action('triggered action'),
    },
  },
}

export const style = ({ editMode, newMode, empty }) => {
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
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-style-form {...newMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-style-form {...newMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-style-form {...editMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-style-form {...editMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-style-form {...empty} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-style-form {...empty} />
        </div>
      </div>
    </div>
  )
}
