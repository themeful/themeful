import { h } from '@stencil/core'

export default {
  title: 'Forms/Style Guide',
  args: {
    newMode: {
      formData: {
        fields: {
          baseFontSize: 16,
        },
      },
    },
    editMode: {
      formData: {
        identifier: 'styleGuide1',
        fields: {
          name: 'StyleGuide Name',
          baseFontSize: 16,
        },
      },
    },
  },
}

export const styleGuide = ({ editMode, newMode }) => {
  return (
    <div>
      <div class="header">
        <h1>Style Guide Form</h1>
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
          <tf-style-guide-form {...newMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-style-guide-form {...newMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
          <tf-style-guide-form {...editMode} />
        </div>
        <div style={{ padding: '1rem' }}>
          <tf-style-guide-form {...editMode} />
        </div>
      </div>
    </div>
  )
}
