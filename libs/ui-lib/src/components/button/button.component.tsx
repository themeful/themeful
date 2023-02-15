import { Component, h, Prop } from '@stencil/core'
import { ButtonKind } from './interfaces'

@Component({
  tag: 'tf-button',
  styleUrl: 'button.component.scss',
  shadow: true,
})
export class ButtonComponent {
  /** Button type*/
  @Prop() public type = 'button'

  /** Button kind */
  @Prop() public kind: ButtonKind = 'secondary'

  /** Button size */
  @Prop() public size?: 'small' | 'large' | 'icon'

  /** Active state */
  @Prop() public active = false

  /** Disabled state */
  @Prop() public disabled = false

  public render(): HTMLTfButtonElement {
    return (
      <button
        type={this.type}
        class={`button ${this.kind} ${this.size ?? ''}${this.active ? ' active' : ''}`}
        disabled={this.disabled}
      >
        <slot />
      </button>
    )
  }
}
