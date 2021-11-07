import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { ExtendedStyle, StyleFormAction, StyleFormData } from '@typings'

@Component({
  tag: 'tf-style-form',
  styleUrl: 'style-form.component.scss',
  shadow: true,
})
export class StyleFormComponent {
  /** Data for the form */
  @Prop() formData: StyleFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<StyleFormAction>

  @State() changed = false
  @State() editMode: boolean
  @State() type: string

  private controls: {
    [key: string]:
      | HTMLTfTextInputElement
      | HTMLTfSelectInputElement
      | HTMLTfSuggestInputElement
      | HTMLTfColorInputElement
  } = {}

  public componentWillLoad(): void {
    this.editMode = this.formData?.identifier?.style && true
    this.type = this.formData.fields?.type
  }

  public componentDidLoad(): void {
    this.action.emit({ action: 'open' })
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
            fields: this.formValues() as unknown as ExtendedStyle,
          })
        } else {
          this.action.emit({
            action: 'create',
            identifier: this.formData.identifier,
            fields: this.formValues() as unknown as ExtendedStyle,
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

  public render(): HTMLTfStyleFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>{this.editMode ? 'Edit' : 'Create'} Style</h3>
        <tf-select-input
          ref={(el: HTMLTfSelectInputElement) => (this.controls['type'] = el)}
          label="Type"
          items={this.formData.propertyTypes}
          value={this.formData.fields?.type}
          {...{
            onInputChange: ({ target }) => {
              this.type = (target as HTMLInputElement).value
            },
          }}
          required
        />
        <tf-suggest-input
          ref={(el: HTMLTfSuggestInputElement) => (this.controls['group'] = el)}
          label="Group"
          items={this.formData.groups}
          value={this.formData.fields?.group}
          minLength={4}
        />
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.controls['name'] = el)}
          label="Name"
          value={this.formData.fields?.name}
          minLength={3}
        />
        {this.type === 'color' ? (
          <tf-color-input
            ref={(el: HTMLTfColorInputElement) =>
              this.type === 'color' ? (this.controls['value'] = el) : el
            }
            label="Color"
            required
            value={this.formData.fields?.value}
          />
        ) : (
          <tf-text-input
            ref={(el: HTMLTfTextInputElement) =>
              this.type !== 'color' ? (this.controls['value'] = el) : el
            }
            label="Value"
            value={this.formData.fields?.value}
            minLength={3}
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
