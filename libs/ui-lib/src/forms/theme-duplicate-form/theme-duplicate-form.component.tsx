import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { FormValues, ThemeFormAction, ThemeFormData } from '@typings'
import '../../components/button'
import '../../components/inputs/text-input'

@Component({
  tag: 'tf-theme-duplicate-form',
  styleUrl: 'theme-duplicate-form.component.scss',
  shadow: true,
})
export class ThemeDuplicateComponent {
  /** Data for the form */
  @Prop() formData!: ThemeFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<ThemeFormAction>

  @State() changed = false

  private controls: { [key: string]: HTMLTfTextInputElement } = {}
  private originName!: string

  public componentWillLoad(): void {
    this.originName = this.formData.fields?.name as string
  }

  public componentDidLoad(): void {
    this.action.emit({ action: 'open' })
  }

  private formValues = (): FormValues =>
    Object.entries(this.controls).reduce(
      (result: { [key: string]: string | number }, [key, control]) => {
        result[key] = control.value
        return result
      },
      {}
    )

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
          controller: 'theme',
          identifier: this.formData.identifier as string,
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

  private nameValidation = (name: string | number): string | null =>
    name !== this.originName ? null : 'Please change the name'

  public render(): HTMLTfThemeDuplicateFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>Duplicate: {this.originName}</h3>
        <tf-text-input
          ref={(el: HTMLTfTextInputElement | undefined) =>
            (this.controls['name'] = el as HTMLTfTextInputElement)
          }
          label="Name"
          value={`${this.formData.fields?.name} Copy`}
          validation={this.nameValidation}
          required
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
