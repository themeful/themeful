import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { StyleGuideBase } from '@typings'

@Component({
  tag: 'tf-style-guide-form',
  styleUrl: 'style-guide-form.component.scss',
  shadow: true,
})
export class StyleGuideFormComponent {
  private nameCtrl: HTMLTfTextInputElement
  private baseFontSizeCtrl: HTMLTfTextInputElement
  /** Data for the form */
  @Prop() formData: StyleGuideBase

  /** StyleGuide slug */
  @Prop() styleGuide: string

  /** Event emitted when the item is clicked */
  @Event() close: EventEmitter

  @State() changed = false
  @State() name: string
  @State() baseFontSize: number
  @State() editMode: boolean

  componentDidLoad(): void {
    this.editMode = this.styleGuide && true
    this.name = this.formData.name
    this.baseFontSize = this.formData.baseFontSize
  }

  private changeName = (event): void => {
    this.changed = true
    this.name = event.target.value
  }

  private changeFontSize = (event): void => {
    this.changed = true
    this.baseFontSize = event.target.value
  }

  private validate = (): Promise<boolean> => {
    return Promise.resolve(true) // Promise.all([this.nameCtrl.validate(), this.baseFontSizeCtrl.validate()]).map(([name, baseFontSize]))
  }

  private save = (event: Event): void => {
    event.preventDefault()
    console.log(this.nameCtrl.validate(), this.baseFontSizeCtrl.validate())
    if (this.changed && this.validate()) {
      console.log('save')
    }
  }

  private cancel = (): void => {
    this.close.emit()
  }

  private remove = (): void => {
    if (this.editMode) {
      console.log('remove')
    }
  }

  private baseFontSizeValidation = (value): string | null =>
    Number(value) > 0 ? null : 'Please enter a number'

  render() {
    return (
      <form class="form" onSubmit={this.save}>
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.nameCtrl = el)}
          label="Name"
          value={this.name}
          onInput={this.changeName}
          minLength={4}
        />
        <tf-text-input
          ref={(el: HTMLTfTextInputElement) => (this.baseFontSizeCtrl = el)}
          label="Base Font Size"
          value={this.baseFontSize}
          onInput={this.changeFontSize}
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
