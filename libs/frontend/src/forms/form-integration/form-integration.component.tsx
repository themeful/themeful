import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { Subject } from 'rxjs'

@Component({
  tag: 'tf-form-integration',
  styleUrl: 'form-integration.component.scss',
  shadow: true,
})
export class FormIntegrationComponent {
  /** FormData */
  @Prop() formData$ = new Subject()
  @State() show = false
  @State() formData: any

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
    this.formData$.subscribe((formData) => {
      console.log(formData)
      this.formData = formData
      this.args = { formData, onAction: this.onAction }
      this.show = true
    })
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
        {this.show && this.renderForm(this.formData.form)}
      </tf-overlay>
    )
  }
}
