import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import { of } from 'rxjs'
import sample from './themes.sample.json'

export default {
  title: 'Pages/Themes',
  args: {
    bundle$: of(sample),
    onAction: action('triggered action'),
  },
}

export const themes = (args) => {
  return (
    <div>
      <div class="header">
        <h1>Themes</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative' }}>
          <tf-themes {...args} />
        </div>
      </div>
    </div>
  )
}
