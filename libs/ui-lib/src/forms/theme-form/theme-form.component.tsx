import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { FormValues, ThemeFormAction, ThemeFormData } from '@typings'
import '../../components/button'
import '../../components/inputs/select-input'
import '../../components/inputs/text-input'

@Component({
  tag: 'tf-theme-form',
  styleUrl: 'theme-form.component.scss',
  shadow: true,
})
export class ThemeFormComponent {
  /** Data for the form */
  @Prop() formData!: ThemeFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<ThemeFormAction>

  @State() changed = false
  @State() editMode!: boolean

  private controls: { [key: string]: HTMLTfTextInputElement | HTMLTfSelectInputElement } = {}

  public componentWillLoad(): void {
    this.editMode = !!this.formData.identifier && true
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

  private dirty = (): Promise<boolean> =>
    Promise.all(Object.values(this.controls).map((control) => control.dirty())).then((controls) =>
      controls.some((valid) => valid)
    )

  private save = async (event: Event): Promise<void> => {
    event.preventDefault()
    Promise.all([this.dirty(), this.validate()]).then(([dirty, valid]) => {
      if (dirty && valid) {
        if (this.editMode) {
          this.action.emit({
            action: 'update',
            identifier: this.formData.identifier as string,
            fields: this.formValues() as unknown as { name: string; styleGuide: string },
          })
        } else {
          this.action.emit({
            action: 'create',
            fields: this.formValues() as unknown as { name: string; styleGuide: string },
          })
        }
      } else if (valid) {
        this.action.emit({ action: 'close' })
      }
    })
  }

  private cancel = (): void => {
    this.action.emit({ action: 'close' })
  }

  private remove = (): void => {
    if (this.editMode) {
      this.action.emit({ action: 'delete', identifier: this.formData.identifier as string })
    }
  }

  public render(): HTMLTfThemeFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>{this.editMode ? 'Edit' : 'Create'} Theme</h3>
        <tf-text-input
          ref={(el: HTMLTfTextInputElement | undefined) =>
            (this.controls['name'] = el as HTMLTfTextInputElement)
          }
          label="Name"
          value={this.formData.fields?.name as string}
          required
        />
        <tf-select-input
          ref={(el: HTMLTfSelectInputElement | undefined) =>
            (this.controls['styleGuide'] = el as HTMLTfSelectInputElement)
          }
          label="Style Guide"
          items={this.formData.styleGuides}
          value={this.formData.fields?.styleGuide as string}
          disabled={this.editMode}
          required
        />
        <div class="form__controls">
          {this.editMode && (
            <tf-button kind="danger" onClick={this.remove}>
              Delete
            </tf-button>
          )}
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
