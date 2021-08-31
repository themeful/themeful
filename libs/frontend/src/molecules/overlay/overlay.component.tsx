import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-overlay',
  styleUrl: 'overlay.component.scss',
  shadow: true,
})
export class TfOverlay {
  /**
   * The first name
   */
  @Prop() first: string

  /**
   * The middle name
   */
  @Prop() middle: string

  /**
   * The last name
   */
  @Prop() last: string

  // private getText(): string {
  //   return `${this.first} ${this.middle} ${this.last}`
  // }

  render() {
    return (
      <div class="overlay__backdrop">
        <div class="overlay">
          <button class="m4-button m4-button--icon overlay__close">
            <i class="gg-close"></i>
          </button>
          <slot />
        </div>
      </div>
    )
  }
}
