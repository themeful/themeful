import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-navigation',
  styleUrl: 'navigation.component.scss',
  shadow: true,
})
export class NavigationComponent {
  /** Navigation size */
  @Prop() size: 'small' | 'large'

  /** Active state */
  @Prop() active = ''

  /** Items */
  @Prop() items = []

  /** Input Event */
  @Event({ composed: false }) itemClick: EventEmitter

  private click = (item: any): void => {
    if (item.selectable) {
      this.active = item.slug
    }
    if (item.callback) {
      item.callback()
    }
    if (item.slug) {
      this.itemClick.emit(item.slug)
    }
  }

  private renderItem = (item: any): HTMLElement => (
    <tf-button
      {...{
        size: this.size,
        kind: item.selectable ? 'selectable' : 'secondary',
        active: item.selectable && item.slug === this.active,
        onClick: () => {
          this.click(item)
        },
      }}
    >
      {item.label}
    </tf-button>
  )

  public render(): HTMLTfNavigationElement {
    return (
      <nav class="navigation">
        <div class="nav__left button-group">
          {this.items.filter((item) => item.position !== 'right').map(this.renderItem)}
        </div>
        <div class="nav__right button-group">
          {this.items.filter((item) => item.position === 'right').map(this.renderItem)}
        </div>
      </nav>
    )
  }
}
