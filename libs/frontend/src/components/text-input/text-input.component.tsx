import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core'
@Component({
  tag: 'tf-text-input',
  styleUrl: 'text-input.component.scss',
})
export class TextInputComponent {
  @Element() el: HTMLTfTextInputElement

  /** Input type */
  @Prop() type = 'text'

  /** Input label */
  @Prop() label: string

  /** Required input */
  @Prop() required = false

  /** Min input */
  @Prop() minLength: number

  /** Max input */
  @Prop() maxLength: number

  /** Input value */
  @Prop({ mutable: true }) value: string

  /** validation function */
  @Prop() validation: (string) => string | null

  /** Input Event */
  @Event() inputChange: EventEmitter

  @State() touched = false
  @State() changed = false
  @State() valid = true
  @State() errorHint = ''

  @Watch('value')
  valueChanged() {
    const inputEl = this.el.querySelector('input')
    if (inputEl.value !== this.value) {
      inputEl.value = this.value
    }
  }

  private inputChanged = (event: Event) => {
    const val = event.target && (event.target as HTMLInputElement).value
    this.changed = true
    this.value = val
    this.inputChange.emit(this.value)
    if (!this.valid) {
      this.validate()
    }
  }

  private blur = (): void => {
    this.validate()
    this.touched = true
  }

  private validate = (): void => {
    let state = true
    let error = ''
    if (this.validation !== undefined) {
      const result = this.validation(this.value)
      state = result === null
      error = state ? '' : result
      console.log(result, state, error)
    }
    if (state && this.required) {
      state = this.value !== ''
      error = `This value is required`
    }
    if (state && this.minLength !== undefined) {
      state = this.value.length >= this.minLength
      error = `The min length is ${this.minLength}`
    }
    if (state && this.maxLength !== undefined) {
      state = this.value.length <= this.maxLength
      error = `The max length is ${this.maxLength}`
    }
    this.errorHint = error
    this.valid = state
  }

  render(): HTMLTfTextInputElement {
    return (
      <div
        class={`text-input${this.valid && this.changed ? ' text-input--valid' : ''}${
          !this.valid && this.touched ? ' text-input--error' : ''
        }`}
      >
        <label>
          {this.label}
          <div>
            <input
              value={this.value}
              type={this.type}
              onInput={this.inputChanged}
              onBlur={this.blur}
            ></input>
          </div>
        </label>
        <p>{this.errorHint}</p>
      </div>
    )
  }
}
