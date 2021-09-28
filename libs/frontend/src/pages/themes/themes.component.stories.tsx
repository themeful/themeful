import { h } from '@stencil/core'

export default {
  title: 'Pages/Themes',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
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
