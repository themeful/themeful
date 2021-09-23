import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core'
@Component({
  tag: 'tf-text-input',
  styleUrl: 'text-input.component.scss',
})
export class TextInputComponent {
  @State() input: HTMLInputElement

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
  @Prop({ mutable: true }) value: string | number

  /** validation function */
  @Prop() validation: (string) => string | null

  /** Input Event */
  @Event() inputChange: EventEmitter

  @State() touched = false
  @State() changed = false
  @State() valid: boolean
  @State() errorHint = ''

  @Watch('value')
  valueChanged() {
    if (this.input.value !== this.value) {
      this.input.value = this.value.toString()
    }
  }

  private inputChanged = () => {
    this.changed = true
    this.value = this.input.value
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
    let error = ''
    if (this.validation !== undefined && this.validation(this.value) !== null) {
      error = this.validation(this.value)
    } else if (this.required && this.value !== '') {
      error = `This value is required`
    } else if (this.value?.toString().length < this.minLength) {
      error = `The min length is ${this.minLength}`
    } else if (this.value?.toString().length > this.maxLength) {
      error = `The max length is ${this.maxLength}`
    }
    this.errorHint = error
    this.valid = error === ''
  }

  render(): HTMLTfTextInputElement {
    return (
      <Host>
        <label
          class={`text-input${this.valid && this.touched ? ' text-input--valid' : ''}${
            !this.valid && this.touched ? ' text-input--error' : ''
          }`}
        >
          <span class="text-input__label">{this.label}</span>
          <input
            ref={(el: HTMLInputElement) => (this.input = el)}
            class="text-input__input"
            value={this.value}
            type={this.type}
            onInput={this.inputChanged}
            onBlur={this.blur}
          ></input>
          <p class="text-input__hint">{this.errorHint}</p>
        </label>
      </Host>
    )
  }
}
