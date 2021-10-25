import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-navigation',
  styleUrl: 'navigation.component.scss',
  shadow: true,
})
export class NavigationComponent {
  /** Navigation size */
  @Prop() size: 'small' | 'large' | 'icon'

  /** Active state */
  @Prop() active = false

  /** Disabled state */
  @Prop() disabled: false

  public render(): HTMLTfNavigationElement {
    return (
      <nav class={`navigation ${this.size ?? ''}${this.active ? ' active' : ''}`}>
        <slot />
      </nav>
    )
  }
}
