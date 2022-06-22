import { Component, Event, EventEmitter, h, Host } from '@stencil/core'
import { FormIntegrationActions } from '@typings'
import { Subject, Subscription } from 'rxjs'
import '../../components/button'
import '../../components/icon'
import '../../components/menu'
import '../../components/navigation'
import '../../components/property'
import '../../forms/form-integration'

@Component({
  tag: 'tf-components',
  styleUrl: 'components.component.scss',
  shadow: true,
})
export class ComponentsComponent {
  private formData$ = new Subject()
  private nav = []

  private sub = new Subscription()

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<FormIntegrationActions>

  private onAction = ({ detail }): void => {
    if (detail.action !== 'close') {
      this.action.emit(detail)
    }
  }

  public disconnectedCallback(): void {
    this.sub.unsubscribe()
  }

  public render(): HTMLTfThemesElement {
    return (
      <Host>
        <stencil-route-title pageTitle="Themeful - Components" />
        <tf-navigation items={this.nav} size="small" />
        List of Components
        <tf-form-integration {...{ formData$: this.formData$, onAction: this.onAction }} />
      </Host>
    )
  }
}