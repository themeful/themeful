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
          aliasTokens: [
            'atCardBackground1',
            'atButtonBackground1',
            'atCardBackground2',
            'atButtonBackground2',
            'atCardBackground3',
            'atButtonBackground3',
            'atCardBackground4',
            'atButtonBackground4',
            'atCardBackground5',
            'atButtonBackground5',
          ],
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
        <h1>AliasToken Form</h1>
      </div>
      <div class="content content--grid">
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light">
              <tf-alias-token-form {...args} />
            </div>
            <div>
              <tf-alias-token-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
