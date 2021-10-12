import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Forms/Style Guide',
  args: {
    samples: [
      {
        formData: {
          fields: {
            baseFontSize: 16,
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: 'styleGuide1',
          fields: {
            name: 'StyleGuide Name',
            baseFontSize: 16,
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

export const styleGuide = ({ samples }) => {
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
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
              <tf-style-guide-form {...args} />
            </div>
            <div style={{ padding: '1rem' }}>
              <tf-style-guide-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
