import { h } from '@stencil/core'

export default {
  title: 'Components/Navigation',
  args: [
    { label: 'Primary', args: { type: 'button', kind: 'primary' } },
    { label: 'Secondary', args: { type: 'submit', kind: 'secondary' } },
    { label: 'Danger', args: { type: 'button', kind: 'danger' } },
    { label: 'Selectable', args: { type: 'button', kind: 'selectable' } },
  ],
}

export const navigation = ({ args }): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Navigation</h1>
      </div>
      <div class="content content--grid">
        <div class="tf-light">
          <tf-button {...args} />
        </div>
        <div>
          <tf-button {...args} />
        </div>
      </div>
    </div>
  )
}
