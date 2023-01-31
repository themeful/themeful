import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import '../button'
import '../icon'

export interface MenuItem {
  label: string
  icon?: string
  callback?: () => void
}

@Component({
  tag: 'tf-menu',
  styleUrl: 'menu.component.scss',
  shadow: true,
})
export class MenuComponent {
  /** Items */
  @Prop() items: MenuItem[] = []

  @State() open = false

  /** Input Event */
  @Event({ composed: false }) itemClick!: EventEmitter

  private click = (item: MenuItem): void => {
    this.open = false
    if (item.callback !== undefined) {
      item.callback()
    }
  }

  private renderItem = (item: MenuItem): HTMLElement => (
    <tf-button
      {...{
        size: 'small',
        kind: 'menu',
        onClick: () => {
          this.click(item)
        },
      }}
    >
      {item.icon && <tf-icon icon={item.icon} />}
      {item.label}
    </tf-button>
  )

  public render(): HTMLTfMenuElement {
    return (
      <div class="menu">
        <tf-button
          {...{
            onClick: () => {
              this.open = !this.open
            },
            title: 'menu',
            size: 'icon',
          }}
        >
          <tf-icon icon="menu" />
        </tf-button>
        {this.open && <div class="backdrop" {...{ onClick: () => (this.open = false) }}></div>}
        {this.open && <div class="menu-items button-group">{this.items.map(this.renderItem)}</div>}
      </div>
    )
  }
}
