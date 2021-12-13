import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'

export interface NavigationItem {
  label: string
  slug?: string
  selectable?: boolean
  position?: string
  callback?: () => void
}

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
  @Prop() items: NavigationItem[] = []

  /** Input Event */
  @Event({ composed: false }) itemClick: EventEmitter

  private click = (item: NavigationItem): void => {
    if (item.selectable) {
      this.active = item.slug
    }
    if (item.callback !== undefined) {
      item.callback()
    }
    if (item.slug !== undefined) {
      this.itemClick.emit(item.slug)
    }
  }

  private renderItem = (item: NavigationItem): HTMLElement => (
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
        <div class="nav__spacer"></div>
        <div class="nav__right button-group">
          {this.items.filter((item) => item.position === 'right').map(this.renderItem)}
        </div>
      </nav>
    )
  }
}
