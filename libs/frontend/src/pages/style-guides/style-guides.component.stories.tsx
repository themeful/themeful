import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import { of } from 'rxjs'
import sample from './style-guides.sample.json'

export default {
  title: 'Pages/Style Guides',
  args: {
    styleGuides$: of(sample),
    onAction: action('triggered action'),
  },
}

export const styleGuides = (args) => {
  return (
    <div>
      <div class="header">
        <h1>Style Guides</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative' }}>
          <tf-style-guides {...args} />
        </div>
      </div>
    </div>
  )
}
