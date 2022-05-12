import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-overlay',
  styleUrl: 'overlay.component.scss',
  shadow: true,
})
export class OverlayComponent {
  /** Overlay visiblity */
  @Prop() show = false

  /** Event emitted when the item is clicked */
  @Event({ composed: false }) close: EventEmitter

  private click = (): void => {
    this.close.emit()
  }

  public render(): HTMLTfOverlayElement {
    if (this.show) {
      return (
        <div class="overlay__wrapper">
          <div class="overlay__backdrop" onClick={this.click}></div>
          <div class="overlay">
            <tf-button class="overlay__close" size="icon" onClick={this.click}>
              <tf-icon icon="close" />
            </tf-button>
            <slot />
          </div>
        </div>
      )
    }
  }
}
