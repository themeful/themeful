import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Forms/Theme',
  args: {
    newMode: {
      formData: {
        fields: {
          baseFontSize: 16,
        },
      },
      onAction: action('triggered action'),
    },
    editMode: {
      formData: {
        identifier: 'styleGuide1',
        fields: {
          name: 'StyleGuide Name',
          baseFontSize: 16,
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

export const theme = ({ editMode, newMode, empty }) => {
  return (
    <div>
      <div class="header">
        <h1>Theme Form</h1>
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
          <tf-theme-form {...newMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-theme-form {...newMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-theme-form {...editMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-theme-form {...editMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-theme-form {...empty} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-theme-form {...empty} />
        </div>
      </div>
    </div>
  )
}
