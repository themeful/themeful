import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-icon',
  styleUrl: 'icon.component.scss',
  shadow: true,
})
export class IconComponent {
  /**
   * The icon name
   */
  @Prop() icon: string

  /**
   * The icon size
   */
  @Prop() size: 'small' | 'large'

  render(): JSX.Element {
    return (
      <div class={`icon ${this.size ?? ''}`}>
        <i class={`gg-${this.icon}`} />
      </div>
    )
  }
}
