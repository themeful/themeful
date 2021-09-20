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

  private validate = (): boolean => {
    return this.name.length > 3 && Number(this.baseFontSize) > 0
  }

  private save = (): void => {
    console.log(this.changed, this.validate(), this.name, this.baseFontSize)
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

  render() {
    return (
      <div>
        <label>
          Name
          <input value={this.name} onInput={this.changeName} />
        </label>
        <label>
          BaseFontSize
          <input value={this.baseFontSize} onInput={this.changeFontSize} />
        </label>
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
      </div>
    )
  }
}
