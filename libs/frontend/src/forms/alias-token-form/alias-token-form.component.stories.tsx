import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Forms/Alias Token',
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

export const aliasToken = ({ editMode, newMode, empty }) => {
  return (
    <div>
      <div class="header">
        <h1>Alias Token Form</h1>
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
          <tf-alias-token-form {...newMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-alias-token-form {...newMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-alias-token-form {...editMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-alias-token-form {...editMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-alias-token-form {...empty} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-alias-token-form {...empty} />
        </div>
      </div>
    </div>
  )
}
