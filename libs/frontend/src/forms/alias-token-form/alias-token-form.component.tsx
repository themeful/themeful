import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { AliasTokenFormAction, AliasTokenFormData, FormValues } from '@typings'

@Component({
  tag: 'tf-alias-token-form',
  styleUrl: 'alias-token-form.component.scss',
  shadow: true,
})
export class AliasTokenFormComponent {
  /** Data for the form */
  @Prop() formData: AliasTokenFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<AliasTokenFormAction>

  @State() changed = false
  @State() editMode: boolean

  private controls: { [key: string]: HTMLTfMultiSelectInputElement } = {}

  public componentDidLoad(): void {
    this.editMode = this.formData.identifier && true
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

  private dirty = (): Promise<boolean> =>
    Promise.all(Object.values(this.controls).map((control) => control.dirty())).then((controls) =>
      controls.some((valid) => valid)
    )

  private save = async (event: Event): Promise<void> => {
    event.preventDefault()
    console.log('save out')
    Promise.all([this.dirty(), this.validate()]).then(([dirty, valid]) => {
      console.log('save in', dirty, valid)
      if (dirty && valid) {
        this.action.emit({
          action: 'update',
          identifier: this.formData.identifier,
          fields: this.formValues() as unknown as { selected: string[] },
        })
      } else if (valid) {
        this.action.emit({ action: 'close' })
      }
    })
  }

  private cancel = (): void => {
    this.action.emit({ action: 'close' })
  }

  public render(): HTMLTfAliasTokenFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>Edit Alias Tokens</h3>
        <tf-multi-select-input
          ref={(el: HTMLTfMultiSelectInputElement) => (this.controls['selected'] = el)}
          label="Name"
          items={this.formData.aliasTokens}
          value={this.formData.fields?.selected}
        />
        <div class="form__controls">
          <tf-button kind="secondary" onClick={this.cancel}>
            Cancel
          </tf-button>
          <tf-button kind="primary" onClick={this.save} type="submit">
            Save
          </tf-button>
        </div>
      </form>
    )
  }
}
