import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { FormValues, StyleGuideFormAction, StyleGuideFormData } from '@typings'
import '../../components/button'
import '../../components/inputs/text-input'

@Component({
  tag: 'tf-style-guide-duplicate-form',
  styleUrl: 'style-guide-duplicate-form.component.scss',
  shadow: true,
})
export class StyleGuideDuplicateFormComponent {
  /** Data for the form */
  @Prop() formData: StyleGuideFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<StyleGuideFormAction>

  @State() changed = false

  private controls: { [key: string]: HTMLTfTextInputElement } = {}
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
          controller: 'styleguide',
          identifier: this.formData.identifier,
          action: 'duplicate',
          fields: this.formValues() as unknown as { name: string },
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

  public render(): HTMLTfStyleGuideDuplicateFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>Duplicate: {this.originName}</h3>
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.controls['name'] = el)}
          label="Name"
          value={`${this.formData.fields?.name} Copy`}
          validation={this.nameValidation}
          minLength={4}
        />

        <div class="form__controls">
          <tf-button kind="secondary" onClick={this.cancel}>
            Cancel
          </tf-button>
          <tf-button kind="primary" onClick={this.save} type="submit">
            Duplicate
          </tf-button>
        </div>
      </form>
    )
  }
}
