import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core'

@Component({
  tag: 'tf-text-input',
  styleUrl: 'text-input.component.scss',
  shadow: true,
})
export class TextInputComponent {
  private input!: HTMLInputElement

  /** Input type */
  @Prop() type = 'text'

  /** Input label */
  @Prop() label!: string

  /** Required input */
  @Prop() required = false

  /** Disabled input */
  @Prop() disabled = false

  /** Min input */
  @Prop() minLength = 0

  /** Max input */
  @Prop() maxLength = 999999

  /** Input value */
  @Prop({ mutable: true }) value!: string | number

  /** validation function */
  @Prop() validation?: (value: string | number) => string | null

  /** Input Event */
  @Event({ composed: false }) inputChange!: EventEmitter

  @State() touched = false
  @State() changed = false
  @State() valid!: boolean
  @State() error = ''

  /** Validate value */
  @Method()
  async validate(): Promise<boolean> {
    this.touched = true
    this.value = this.value || this.input.value
    return Promise.resolve(this.internalValidation())
  }

  /** Changed value */
  @Method()
  async dirty(): Promise<boolean> {
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
      if (this.required && (this.value === '' || this.value === undefined)) {
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

  public render(): HTMLTfTextInputElement {
    return (
      <Host>
        <label
          class={`text-input${this.valid && this.touched ? ' text-input--valid' : ''}${
            !this.valid && this.touched ? ' text-input--error' : ''
          }`}
        >
          <span class="text-input__label">{this.label}</span>
          <input
            ref={(el: HTMLInputElement | undefined) => (this.input = el as HTMLInputElement)}
            class="text-input__input"
            type={this.type}
            onInput={this.inputChanged}
            onBlur={this.blur}
            disabled={this.disabled}
            value={this.value}
          />
          <p class="text-input__hint">{this.error}</p>
        </label>
      </Host>
    )
  }
}
