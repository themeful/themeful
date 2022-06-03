import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { FormValues, StyleGuideBase, StyleGuideFormAction, StyleGuideFormData } from '@typings'

@Component({
  tag: 'tf-style-guide-form',
  styleUrl: 'style-guide-form.component.scss',
  shadow: true,
})
export class StyleGuideFormComponent {
  /** Data for the form */
  @Prop() formData: StyleGuideFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<StyleGuideFormAction>

  @State() changed = false
  @State() editMode: boolean

  private controls: { [key: string]: HTMLTfTextInputElement } = {}

  public componentWillLoad(): void {
    this.editMode = this.formData.identifier && true
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
            fields: this.formValues() as unknown as StyleGuideBase,
          })
        } else {
          this.action.emit({
            action: 'create',
            fields: this.formValues() as unknown as StyleGuideBase,
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

  private baseFontSizeValidation = (value): string | null =>
    Number(value) > 0 ? null : 'Please enter a number'

  public render(): HTMLTfStyleGuideFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>
          {this.editMode ? 'Edit' : 'Create'}{' '}
          {this.formData.identifier === 'global' ? 'Global' : 'Style Guide'}
        </h3>
        {this.formData.identifier !== 'global' && (
          <tf-text-input
            ref={(el: HTMLTfTextInputElement) => (this.controls['name'] = el)}
            label="Name"
            value={this.formData.fields?.name}
            minLength={4}
          />
        )}
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.controls['baseFontSize'] = el)}
          label="Base Font Size (px)"
          value={this.formData.fields?.baseFontSize}
          validation={this.baseFontSizeValidation}
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
