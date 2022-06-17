import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Pages/Components',
  args: {
    onAction: action('triggered action'),
  },
}

export const components = (args) => {
  return (
    <div>
      <div class="header" style={{ marginBottom: '16px' }}>
        <h1>Components</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative' }}>
          <tf-components {...args} />
        </div>
      </div>
    </div>
  )
}
