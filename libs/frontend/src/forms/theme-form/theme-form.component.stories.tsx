import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Forms/Theme',
  args: {
    samples: [
      {
        formData: {
          fields: {
            name: 'Dark',
            styleGuide: 'styleGuide1',
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: 'styleGuide1_dark',
          fields: {
            name: 'Dark',
            styleGuide: 'styleGuide1',
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

export const theme = ({ samples }) => {
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
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
              <tf-theme-form {...args} />
            </div>
            <div style={{ padding: '1rem' }}>
              <tf-theme-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
