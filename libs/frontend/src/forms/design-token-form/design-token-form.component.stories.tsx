import { propertySelect } from '@properties'
import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Forms/Design Token',
  args: {
    newMode: {
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
    editMode: {
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
    empty: {
      formData: {
        groups: ['Base', 'Content', 'More'],
        propertyTypes: propertySelect,
      },
      onAction: action('triggered action'),
    },
  },
}

export const designToken = ({ editMode, newMode, empty }) => {
  return (
    <div>
      <div class="header">
        <h1>Design Token Form</h1>
      </div>
      <div
        class="content"
        style={{
          display: 'grid',
          gridTemplateColumns: '500px 500px',
          gridAutoRows: '300px',
          gap: '1rem',
        }}
      >
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-design-token-form {...newMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-design-token-form {...newMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-design-token-form {...editMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-design-token-form {...editMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-design-token-form {...empty} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-design-token-form {...empty} />
        </div>
      </div>
    </div>
  )
}
