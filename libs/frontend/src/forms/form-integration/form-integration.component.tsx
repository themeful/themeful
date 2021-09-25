import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-form-integration',
  styleUrl: 'form-integration.component.scss',
  shadow: true,
})
export class FormIntegrationComponent {
  /** Show overlay with form */
  @Prop() show = false

  /** Form data */
  @Prop() formData: any

  /** Event emitted when an action is triggered */
  @Event() action: EventEmitter<any>

  private close = (): void => {
    this.show = false
  }

  private onAction = ({ detail }): void => {
    console.log(detail)
    if (detail.action !== 'close') {
      this.action.emit(detail)
    }
    this.close()
  }

  private args = {}

  public componentWillLoad(): void {
    this.args = { formData: this.formData, onAction: this.onAction }
  }

  private renderForm(form: string): HTMLElement {
    switch (form) {
      case 'styleguide':
        return <tf-style-guide-form {...this.args} />
      default:
        return <div>Form is not defined</div>
    }
  }

  public render(): HTMLTfFormIntegrationElement {
    return (
      <tf-overlay {...{ show: this.show, onClose: this.close }}>
        {this.renderForm(this.formData.form)}
      </tf-overlay>
    )
  }
}
