import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { AliasTokenFormData, AliasTokenReturnFields, DesignTokenFormAction } from '@typings'
import '../../components/button'
import '../../components/inputs/multi-select-input'

@Component({
  tag: 'tf-alias-token-form',
  styleUrl: 'alias-token-form.component.scss',
  shadow: true,
})
export class AliasTokenFormComponent {
  /** Data for the form */
  @Prop() formData!: AliasTokenFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<DesignTokenFormAction>

  @State() changed = false
  @State() editMode!: boolean

  private controls: { [key: string]: HTMLTfMultiSelectInputElement } = {}

  public componentWillLoad(): void {
    this.editMode = !!this.formData.identifier && true
  }
  public componentDidLoad(): void {
    this.action.emit({ action: 'open' })
  }

  private formValues = (): AliasTokenReturnFields => ({
    selected: this.controls['selected'].value,
  })

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
    Promise.all([this.dirty(), this.validate()]).then(([dirty, valid]) => {
      if (dirty && valid) {
        this.action.emit({
          controller: 'designToken',
          action: 'updateAliasTokens',
          identifier: this.formData.identifier,
          fields: this.formValues(),
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
        <h3>Select Alias Tokens</h3>
        <tf-multi-select-input
          ref={(el: HTMLTfMultiSelectInputElement | undefined) =>
            (this.controls['selected'] = el as HTMLTfMultiSelectInputElement)
          }
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
