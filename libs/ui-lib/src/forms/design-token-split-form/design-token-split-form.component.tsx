import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import {
  DesignTokenFormAction,
  DesignTokenSplitFormData,
  DesignTokenSplitFormFields,
  FormValues,
} from '@typings'
import '../../components/button'
import '../../components/inputs/multi-select-input'
import '../../components/inputs/text-input'

@Component({
  tag: 'tf-design-token-split-form',
  styleUrl: 'design-token-split-form.component.scss',
  shadow: true,
})
export class DesignTokenSplitFormComponent {
  /** Data for the form */
  @Prop() formData: DesignTokenSplitFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<DesignTokenFormAction>

  @State() changed = false

  private controls: { [key: string]: HTMLTfMultiSelectInputElement | HTMLTfTextInputElement } = {}
  private originName: string

  public componentWillLoad(): void {
    this.originName = this.formData.fields.name
  }
  public componentDidLoad(): void {
    this.action.emit({ action: 'open' })
  }

  private formValues = (): FormValues =>
    Object.entries(this.controls).reduce((result, [key, control]) => {
      result[key] = control.value
      return result
    }, {})

  private validate = (): Promise<boolean> =>
    Promise.all(Object.values(this.controls).map((control) => control.validate())).then(
      (controls) => controls.every((valid) => valid)
    )

  private dirty = (): Promise<boolean> => Promise.resolve(true)

  private save = async (event: Event): Promise<void> => {
    event.preventDefault()
    Promise.all([this.dirty(), this.validate()]).then(([dirty, valid]) => {
      if (dirty && valid) {
        this.action.emit({
          controller: 'designToken',
          action: 'split',
          identifier: this.formData.identifier,
          fields: this.formValues() as unknown as DesignTokenSplitFormFields,
        })
      } else if (valid) {
        this.action.emit({ action: 'close' })
      }
    })
  }

  private cancel = (): void => {
    this.action.emit({ action: 'close' })
  }

  private nameValidation = (name: string): string | null =>
    name !== this.originName ? null : 'Please change the name'

  public render(): HTMLTfDesignTokenSplitFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>Split: {this.originName}</h3>
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.controls['name'] = el)}
          label="Name"
          value={`${this.formData.fields?.name} Copy`}
          validation={this.nameValidation}
          minLength={4}
        />
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.controls['description'] = el)}
          label="Description"
          value={this.formData.fields?.description}
        />
        <tf-multi-select-input
          ref={(el: HTMLTfMultiSelectInputElement) => (this.controls['selected'] = el)}
          items={this.formData.aliasTokens}
          value={this.formData.fields?.selected}
        />
        <div class="form__controls">
          <tf-button kind="secondary" onClick={this.cancel}>
            Cancel
          </tf-button>
          <tf-button kind="primary" onClick={this.save} type="submit">
            Split
          </tf-button>
        </div>
      </form>
    )
  }
}
