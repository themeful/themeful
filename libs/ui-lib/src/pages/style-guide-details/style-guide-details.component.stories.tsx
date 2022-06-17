import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import { of } from 'rxjs'
import sample from './style-guide-details.sample.json'

export default {
  title: 'Pages/Style Guide Details',
  args: {
    styleGuides$: of(sample),
    match: { params: { slug: 'styleGuide1' } },
    onAction: action('triggered action'),
  },
}

export const styleGuideDetails = (args) => {
  return (
    <div>
      <div class="header">
        <h1>Style Guide Details</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative' }}>
          <tf-style-guide-details {...args} />
        </div>
      </div>
    </div>
  )
}
