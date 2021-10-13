import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { ThemeValueFormAction, ThemeValueFormData, ThemeValueFormFields } from '@typings'

@Component({
  tag: 'tf-theme-value-form',
  styleUrl: 'theme-value-form.component.scss',
  shadow: true,
})
export class ThemeValueFormComponent {
  /** Data for the form */
  @Prop() formData: ThemeValueFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<ThemeValueFormAction>

  @State() changed = false
  @State() editMode: boolean
  @State() type: string

  private controls: {
    [key: string]: HTMLTfTextInputElement | HTMLTfSelectInputElement | HTMLTfColorInputElement
  } = {}

  public componentDidLoad(): void {
    this.editMode = this.formData?.identifier?.media && true
    this.type = this.formData.type
  }

  private formValues = (): { [key: string]: string | number } =>
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
    Promise.all([this.dirty(), this.validate()]).then(([dirty, valid]) => {
      if (dirty && valid) {
        if (this.editMode) {
          this.action.emit({
            action: 'update',
            identifier: this.formData.identifier,
            fields: this.formValues() as unknown as ThemeValueFormFields,
          })
        } else {
          this.action.emit({
            action: 'create',
            identifier: this.formData.identifier,
            fields: this.formValues() as unknown as ThemeValueFormFields,
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
      this.action.emit({ action: 'delete', identifier: this.formData.identifier })
    }
  }

  public render(): HTMLTfThemeValueFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>{this.editMode ? 'Edit' : 'Create'} Style</h3>
        <tf-select-input
          ref={(el: HTMLTfSelectInputElement) => (this.controls['media'] = el)}
          label="Media"
          items={this.formData.medias}
          value={this.formData.fields?.media}
          {...{
            onInputChange: ({ target }) => {
              this.type = (target as HTMLInputElement).value
            },
          }}
          required
        />

        {this.type === 'color' ? (
          <tf-color-input
            ref={(el: HTMLTfColorInputElement) =>
              this.type === 'color' ? (this.controls['direct'] = el) : el
            }
            label="Color"
            required
            format="HSL"
            value={this.formData.fields?.direct}
          />
        ) : (
          <tf-text-input
            ref={(el: HTMLTfTextInputElement) =>
              this.type !== 'color' ? (this.controls['direct'] = el) : el
            }
            label="Value"
            value={this.formData.fields?.direct}
            required
          />
        )}
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
