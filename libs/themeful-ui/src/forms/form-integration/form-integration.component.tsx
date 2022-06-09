import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { FormIntegrationActions, FormIntegrations } from '@typings'
import { Subject, Subscription } from 'rxjs'
import '../../components/overlay'
import '../../forms/alias-token-form'
import '../../forms/design-token-form'
import '../../forms/design-token-split-form'
import '../../forms/style-form'
import '../../forms/style-guide-duplicate-form'
import '../../forms/style-guide-form'
import '../../forms/theme-duplicate-form'
import '../../forms/theme-form'
import '../../forms/theme-value-form'

@Component({
  tag: 'tf-form-integration',
  styleUrl: 'form-integration.component.scss',
  shadow: true,
})
export class FormIntegrationComponent {
  /** FormData */
  @Prop() formData$ = new Subject<FormIntegrations>()
  @State() show = false
  @State() formData: FormIntegrations

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<FormIntegrationActions>

  private sub = new Subscription()
  private args = {}

  private close = (): void => {
    this.show = false
  }

  private onAction = ({ detail }): void => {
    if (detail.action !== 'close') {
      this.action.emit({ ...detail, controller: detail.controller || this.formData.form })
    }

    if (detail.action !== 'open') {
      this.close()
    }
  }

  public componentWillLoad(): void {
    this.sub.add(
      this.formData$.subscribe((formData) => {
        this.formData = formData
        this.args = { formData, onAction: this.onAction }
        this.show = true
      })
    )
  }

  public disconnectedCallback(): void {
    this.sub.unsubscribe()
  }

  private renderForm(form: string): HTMLElement {
    switch (form) {
      case 'styleguide':
        return <tf-style-guide-form {...this.args} />
      case 'styleguideDuplicate':
        return <tf-style-guide-duplicate-form {...this.args} />
      case 'style':
        return <tf-style-form {...this.args} />
      case 'theme':
        return <tf-theme-form {...this.args} />
      case 'themeDuplicate':
        return <tf-theme-duplicate-form {...this.args} />
      case 'themeValue':
        return <tf-theme-value-form {...this.args} />
      case 'designToken':
        return <tf-design-token-form {...this.args} />
      case 'designTokenSplit':
        return <tf-design-token-split-form {...this.args} />
      case 'aliasTokenSelect':
        return <tf-alias-token-form {...this.args} />
      default:
        return <div>Form is not defined</div>
    }
  }

  public render(): HTMLTfFormIntegrationElement {
    return (
      <tf-overlay {...{ show: this.show, onClose: this.close }}>
        {this.show && this.renderForm(this.formData.form)}
      </tf-overlay>
    )
  }
}
