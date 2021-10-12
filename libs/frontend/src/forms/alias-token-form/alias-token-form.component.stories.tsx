import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

export default {
  title: 'Forms/Alias Token',
  args: {
    samples: [
      {
        formData: {
          identifier: 'dtActionBg',
          aliasTokens: ['atCardBackground', 'atButtonBackground'],
          fields: {},
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: 'dtActionBg',
          aliasTokens: ['atCardBackground'],
          fields: {
            selected: ['atButtonBackground'],
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: 'dtActionBg',
        },
        onAction: action('triggered action'),
      },
    ],
  },
}

export const aliasToken = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Alias Token Form</h1>
      </div>
      <div
        class="content"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(400px, max-content) minmax(400px, max-content)',
          gap: '1rem',
        }}
      >
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
              <tf-alias-token-form {...args} />
            </div>
            <div style={{ padding: '1rem' }}>
              <tf-alias-token-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
