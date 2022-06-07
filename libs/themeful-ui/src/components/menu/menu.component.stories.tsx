import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Components/Menu',
  args: {
    items: [
      { label: 'Primary', slug: 'primary', icon: 'pen' },
      { label: 'Secondary', slug: 'secondary', icon: 'globe' },
      { label: 'Tertiary', slug: 'tertiary', icon: 'copy' },
    ],
    onItemClick: action('change'),
  },
}

export const menu = (args): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Menu</h1>
      </div>
      <div class="content content--grid">
        <div class="tf-light">
          <tf-menu {...args} />
        </div>
        <div>
          <tf-menu {...args} />
        </div>
      </div>
    </div>
  )
}
