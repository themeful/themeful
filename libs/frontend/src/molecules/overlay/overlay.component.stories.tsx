import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Molecules/Overlay',
}

export const overlay = (args): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Overlay</h1>
      </div>
      <div class="content">
        <tf-overlay {...args} onClose={action('close')}>
          Some content
        </tf-overlay>
      </div>
    </div>
  )
}

overlay.args = {
  show: true,
}

overlay.argsTypes = {
  show: {
    control: {
      type: 'boolean',
    },
  },
}
