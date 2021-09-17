import { h } from '@stencil/core'
import { of } from 'rxjs'
import sample from './style-guide.sample.json'

export default {
  title: 'Pages/Style Guides',
  args: {
    styleGuides$: of(sample),
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
          <tf-style-guides {...args}></tf-style-guides>
        </div>
      </div>
    </div>
  )
}
