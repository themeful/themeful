import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-icon',
  styleUrl: 'icon.component.scss',
  // shadow: true,
})
export class TfIconComponent {
  /**
   * The icon name
   */
  @Prop() icon: string

  /**
   * The icon size
   */
  @Prop() size: 'small' | 'large'

  render() {
    return (
      <div class={`icon ${this.size ?? ''}`}>
        <i class={`gg-${this.icon}`} />
      </div>
    )
  }
}
