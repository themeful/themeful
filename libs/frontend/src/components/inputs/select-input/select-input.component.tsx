import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core'
import { KeyValues } from '@typings'

@Component({
  tag: 'tf-select-input',
  styleUrl: 'select-input.component.scss',
  shadow: true,
})
export class SelectInputComponent {
  @State() input: HTMLSelectElement

  /** Input type */
  @Prop() type = 'text'

  /** Input label */
  @Prop() label: string

  /** Input suggest items */
  @Prop() items: KeyValues = []

  /** Required input */
  @Prop() required = false

  /** Input value */
  @Prop({ mutable: true }) value: string | number

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
    this.error = ''
    if (this.required && this.value === '') {
      this.error = `This value is required`
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
          <select
            ref={(el: HTMLSelectElement) => (this.input = el)}
            class="select-input__input"
            onChange={this.inputChanged}
            onBlur={this.blur}
          >
            {this.items.map((item) => (
              <option value={item.key} selected={item.key === this.value}>
                {item.value}
              </option>
            ))}
          </select>
          <p class="select-input__hint">{this.error}</p>
        </label>
      </Host>
    )
  }
}
