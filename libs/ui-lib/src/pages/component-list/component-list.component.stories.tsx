import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Pages/Component List',
  args: {
    onAction: action('triggered action'),
  },
}

export const componentList = (args) => {
  return (
    <div>
      <div class="header" style={{ marginBottom: '16px' }}>
        <h1>Component List</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative' }}>
          <tf-component-list {...args} />
        </div>
      </div>
    </div>
  )
}
