import { Component, Event, h, EventEmitter, Prop } from '@stencil/core'
import { ButtonKind } from './interfaces'

@Component({
  tag: 'tf-button',
  styleUrl: 'button.component.scss',
  shadow: true,
})
export class TfButton {
  /** Button type*/
  @Prop() type = 'button'

  /** Button kind */
  @Prop() kind: ButtonKind = 'primary'

  /** Active state */
  @Prop() active: false

  /** Disabled state */
  @Prop() disabled: false

  /** Event emitted when the item is clicked */
  @Event() clicked: EventEmitter

  render() {
    return (
      <button
        type={this.type}
        class={`${this.kind}${this.active ? ' active' : ''}`}
        disabled={this.disabled}
        onClick={() => {
          this.clicked.emit()
        }}
      >
        <slot />
      </button>
    )
  }
}
