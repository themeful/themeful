import { h } from '@stencil/core'

export default {
  title: 'Forms/Style Guide',
  args: {
    newMode: {
      formData: {
        baseFontSize: 16,
      },
    },
    editMode: {
      styleGuide: 'styleGuide1',
      formData: {
        name: 'StyleGuide Name',
        baseFontSize: 16,
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
        <div class="tf-light" style={{ background: '#fff' }}>
          <tf-style-guide-form {...newMode} />
        </div>
        <div>
          <tf-style-guide-form {...newMode} />
        </div>
        <div class="tf-light" style={{ background: '#fff' }}>
          <tf-style-guide-form {...editMode} />
        </div>
        <div>
          <tf-style-guide-form {...editMode} />
        </div>
      </div>
    </div>
  )
}
