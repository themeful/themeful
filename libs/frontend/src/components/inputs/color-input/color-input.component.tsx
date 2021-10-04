import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core'
import { ColorTranslator } from 'colortranslator'

@Component({
  tag: 'tf-color-input',
  styleUrl: 'color-input.component.scss',
  shadow: true,
})
export class ColorInputComponent {
  @State() input: HTMLInputElement
  private alpha: HTMLInputElement
  private base: HTMLInputElement
  private pointer: HTMLElement
  private trackMouseMove = false
  private color = {
    base: '',
    h: 0,
    s: 0,
    l: 0,
    a: 1,
  }

  /** Element */
  @Element() el: HTMLTfColorInputElement

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

  private changeAlpha = (): void => {
    this.color.a = Math.round(100 - parseInt(this.alpha.value)) / 100
    console.log(this.alpha.value, this.color)
  }

  private changeBase = (): void => {
    this.color.h = parseInt(this.base.value)
    this.color.base = ColorTranslator.toHEX({ h: this.color.h, s: 100, l: 50 })
    this.setBaseColor(this.color.base)
    this.setCurrentColor(
      ColorTranslator.toHEX({ h: this.color.h, s: this.color.s, l: this.color.l })
    )
  }

  public componentDidLoad(): void {
    this.setBaseColor('#ff0000')
  }

  private setBaseColor(hex: string): void {
    this.el.style.setProperty('--base-color', hex)
  }

  private setCurrentColor(hex: string): void {
    this.el.style.setProperty('--current-color', hex)
  }

  private track = (event): void => {
    if (this.trackMouseMove) {
      if (['mouseleave', 'mouseup'].includes(event.type)) {
        this.trackMouseMove = false
      }

      const left = Math.max(0, Math.min(event.offsetX, event.target.offsetWidth))
      const top = Math.max(0, Math.min(event.offsetY, event.target.offsetHeight))
      this.color.s = Math.round((left / event.target.offsetWidth) * 100)
      this.color.l = Math.round(
        (50 + (100 - this.color.s) / 2) * (1 - top / event.target.offsetHeight)
      )

      this.setCurrentColor(
        ColorTranslator.toHEX({ h: this.color.h, s: this.color.s, l: this.color.l })
      )
      // l = left 0% = #fff 100% = #f00

      this.pointer.style.setProperty('left', `${left}px`)
      this.pointer.style.setProperty('top', `${top}px`)
    } else if (event.type === 'mousedown') {
      this.trackMouseMove = true
    }
  }

  private internalValidation = (): boolean => {
    this.error = (this.validation && this.validation(this.value)) || ''
    if (this.error === '') {
      if (this.required && this.value === '') {
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

  private renderColor(): HTMLElement {
    return (
      <div class="color-input__controls">
        <div
          class="color-input__shade"
          onMouseDown={this.track}
          onMouseLeave={this.track}
          onMouseUp={this.track}
          onMouseMove={this.track}
        >
          <div
            ref={(el: HTMLInputElement) => (this.pointer = el)}
            class="color-input__pointer"
          ></div>
        </div>
        <input
          ref={(el: HTMLInputElement) => (this.base = el)}
          type="range"
          min="0"
          max="360"
          value="50"
          class="color-input__base"
          onInput={this.changeBase}
        />
        <input
          ref={(el: HTMLInputElement) => (this.alpha = el)}
          type="range"
          min="0"
          max="100"
          value="0"
          class="color-input__alpha"
          onInput={this.changeAlpha}
        />
      </div>
    )
  }

  public render(): HTMLTfColorInputElement {
    return (
      <Host class="color-input">
        <label
          class={`color-input${this.valid && this.touched ? ' color-input--valid' : ''}${
            !this.valid && this.touched ? ' color-input--error' : ''
          }`}
        >
          <span class="color-input__label">{this.label}</span>
          <input
            ref={(el: HTMLInputElement) => (this.input = el)}
            class="color-input__input"
            value={this.value}
            type={this.type}
            onInput={this.inputChanged}
            onBlur={this.blur}
          />
          <p class="color-input__hint">{this.error}</p>
        </label>
        {this.renderColor()}
      </Host>
    )
  }
}
