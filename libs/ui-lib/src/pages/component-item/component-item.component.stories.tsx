import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import { of } from 'rxjs'
import sample from './component-item.sample.json'

export default {
  title: 'Pages/Component Item',
  args: {
    componentBundle$: of(sample),
    onAction: action('triggered action'),
  },
}

export const componentItem = (args) => {
  return (
    <div>
      <div class="header" style={{ marginBottom: '16px' }}>
        <h1>Component Item</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', height: '90vh' }}>
          <tf-component-item {...args} />
        </div>
      </div>
    </div>
  )
}
