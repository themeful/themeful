import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'
import { ButtonKind } from './interfaces'

@Component({
  tag: 'tf-button',
  styleUrl: 'button.component.scss',
})
export class ButtonComponent {
  /** Button type*/
  @Prop() type = 'button'

  /** Button kind */
  @Prop() kind: ButtonKind = 'primary'

  /** Button size */
  @Prop() size: 'small' | 'large' | 'icon'

  /** Active state */
  @Prop() active: false

  /** Disabled state */
  @Prop() disabled: false

  /** Event emitted when the item is clicked */
  @Event({ bubbles: true, composed: true }) clicked: EventEmitter

  render() {
    return (
      <button
        type={this.type}
        class={`button ${this.kind} ${this.size ?? ''}${this.active ? ' active' : ''}`}
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
