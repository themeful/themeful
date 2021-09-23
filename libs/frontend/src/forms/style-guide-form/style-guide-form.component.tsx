import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { StyleGuideBase } from '@typings'

@Component({
  tag: 'tf-style-guide-form',
  styleUrl: 'style-guide-form.component.scss',
  shadow: true,
})
export class StyleGuideFormComponent {
  /** Data for the form */
  @Prop() formData: StyleGuideBase

  /** StyleGuide slug */
  @Prop() styleGuide: string

  /** Event emitted when the item is clicked */
  @Event() close: EventEmitter

  @State() changed = false
  @State() editMode: boolean

  private controls: { [key: string]: HTMLTfTextInputElement } = {}

  public componentDidLoad(): void {
    this.editMode = this.styleGuide && true
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
      console.log(dirty, valid)
      if (dirty && valid) {
        console.log('save', this.formValues())
      }
    })
  }

  private cancel = (): void => {
    console.log('close')
    this.close.emit()
  }

  private remove = (): void => {
    if (this.editMode) {
      console.log('remove')
    }
  }

  private baseFontSizeValidation = (value): string | null =>
    Number(value) > 0 ? null : 'Please enter a number'

  public render() {
    return (
      <form class="form" onSubmit={this.save}>
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.controls['name'] = el)}
          label="Name"
          value={this.formData.name}
          minLength={4}
        />
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.controls['baseFontSize'] = el)}
          label="Base Font Size"
          value={this.formData.baseFontSize}
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
