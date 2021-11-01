import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Components/Navigation',
  args: {
    items: [
      { label: 'Primary', slug: 'primary', selectable: true },
      { label: 'Secondary', slug: 'secondary', selectable: true },
      { label: 'Tertiary', slug: 'tertiary' },
      { label: 'Right', slug: 'right', position: 'right' },
    ],
    onItemClick: action('change'),
  },
}

export const navigation = (args): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Navigation</h1>
      </div>
      <div class="content content--grid content--grid-single">
        <div class="tf-light">
          <tf-navigation {...args} active="secondary" />
        </div>
        <div>
          <tf-navigation {...args} active="secondary" />
        </div>
        <div class="tf-light">
          <tf-navigation {...args} size="small" />
        </div>
        <div>
          <tf-navigation {...args} size="small" />
        </div>
      </div>
    </div>
  )
}
