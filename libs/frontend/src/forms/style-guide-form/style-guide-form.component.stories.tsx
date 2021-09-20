import { h } from '@stencil/core'

export default {
  title: 'Forms/Style Guide',
  args: {
    editMode: {
      styleGuide: 'styleGuide1',
      formData: {
        name: 'StyleGuide Name',
        baseFontSize: 16,
      },
    },
    newMode: {
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
      <div class="content" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ position: 'relative', width: '600px' }}>
            <tf-style-guide-form {...newMode} />
          </div>
          <div
            class="tf-light"
            style={{ position: 'relative', width: '600px', background: '#fff' }}
          >
            <tf-style-guide-form {...newMode} />
          </div>
        </div>
        <div class="content" style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ position: 'relative', width: '600px' }}>
            <tf-style-guide-form {...editMode} />
          </div>
          <div
            class="tf-light"
            style={{ position: 'relative', width: '600px', background: '#fff' }}
          >
            <tf-style-guide-form {...editMode} />
          </div>
        </div>
      </div>
    </div>
  )
}
