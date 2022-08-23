import { Component, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core'

@Component({
  tag: 'tf-suggest-input',
  styleUrl: 'suggest-input.component.scss',
  shadow: true,
})
export class SuggestInputComponent {
  private input!: HTMLInputElement

  /** Input label */
  @Prop() label!: string

  /** Input suggest items */
  @Prop() items: string[] = []

  /** Required input */
  @Prop() required = false

  /** Disabled input */
  @Prop() disabled = false

  /** Min input */
  @Prop() minLength!: number

  /** Max input */
  @Prop() maxLength!: number

  /** Input value */
  @Prop({ mutable: true }) value!: string | number

  /** validation function */
  @Prop() validation!: (input: string | number) => string | null

  /** Input Event */
  @Event({ composed: false }) inputChange!: EventEmitter

  @State() touched = false
  @State() changed = false
  @State() valid!: boolean
  @State() error = ''
  private static counter = 0
  private dataListId!: string

  /** Validate value */
  @Method()
  public validate(): Promise<boolean> {
    this.touched = true
    this.value = this.value || this.input.value
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

  public componentWillLoad() {
    SuggestInputComponent.counter += 1
    this.dataListId = `suggestdatalist${SuggestInputComponent.counter}`
  }

  public render(): HTMLTfSuggestInputElement {
    return (
      <label
        class={`suggest-input${this.valid && this.touched ? ' suggest-input--valid' : ''}${
          !this.valid && this.touched ? ' suggest-input--error' : ''
        }`}
      >
        <span class="suggest-input__label">{this.label}</span>
        <input
          ref={(el: HTMLInputElement) => (this.input = el)}
          class="suggest-input__input"
          type="text"
          list={this.dataListId}
          onInput={this.inputChanged}
          onBlur={this.blur}
          autocomplete="off"
          disabled={this.disabled}
          value={this.value}
        />
        <datalist id={this.dataListId}>
          {this.items.map((item) => (
            <option value={item} />
          ))}
        </datalist>
        <p class="suggest-input__hint">{this.error}</p>
      </label>
    )
  }
}
