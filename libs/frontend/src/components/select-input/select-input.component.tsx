import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core'

@Component({
  tag: 'tf-select-input',
  styleUrl: 'select-input.component.scss',
})
export class SelectInputComponent {
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
  @Event({ composed: false }) inputChange: EventEmitter

  @State() touched = false
  @State() changed = false
  @State() valid: boolean
  @State() error = ''

  /** Validate value */
  @Method()
  public validate(): Promise<boolean> {
    this.touched = true
    return Promise.resolve(this.internalValidation())
  }

  /** Changed value */
  @Method()
  public dirty(): Promise<boolean> {
    return Promise.resolve(this.changed)
  }

  @Watch('value')
  public valueChanged(): void {
    if (this.input.value !== this.value) {
      this.input.value = this.value.toString()
    }
  }

  private inputChanged = () => {
    this.changed = true
    this.value = this.input.value
    this.inputChange.emit(this.value)
    if (!this.valid && this.touched) {
      this.internalValidation()
    }
  }

  private blur = (): void => {
    this.internalValidation()
    this.touched = true
  }

  private internalValidation = (): boolean => {
    this.error = (this.validation && this.validation(this.value)) || ''
    if (this.error === '') {
      if (this.required && this.value !== '') {
        this.error = `This value is required`
      } else if ((this.value?.toString().length || 0) < this.minLength) {
        this.error = `The min length is ${this.minLength}`
      } else if (this.value?.toString().length > this.maxLength) {
        this.error = `The max length is ${this.maxLength}`
      }
    }
    this.valid = this.error === ''
    return this.valid
  }

  public render(): HTMLTfSelectInputElement {
    return (
      <Host>
        <label
          class={`select-input${this.valid && this.touched ? ' select-input--valid' : ''}${
            !this.valid && this.touched ? ' select-input--error' : ''
          }`}
        >
          <span class="select-input__label">{this.label}</span>
          <input
            ref={(el: HTMLInputElement) => (this.input = el)}
            class="select-input__input"
            value={this.value}
            type={this.type}
            onInput={this.inputChanged}
            onBlur={this.blur}
          ></input>
          <p class="select-input__hint">{this.error}</p>
        </label>
      </Host>
    )
  }
}
