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
    s: 100,
    l: 50,
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

  private changeAlpha = (): void => {
    this.color.a = Math.round(100 - parseInt(this.alpha.value)) / 100
    this.setCurrentColor()
  }

  private changeBase = (): void => {
    this.color.h = parseInt(this.base.value)
    this.color.base = ColorTranslator.toHEX({ h: this.color.h, s: 100, l: 50 })
    this.setBaseColor(this.color.base)
    this.setCurrentColor()
  }

  public componentDidLoad(): void {
    this.changeBase()
    this.changeAlpha()
    this.setPointer()
  }

  private setBaseColor(hex: string): void {
    this.el.style.setProperty('--base-color', hex)
  }

  private setCurrentColor(): void {
    this.el.style.setProperty(
      '--full-color',
      ColorTranslator.toHEX({ h: this.color.h, s: this.color.s, l: this.color.l })
    )
    this.el.style.setProperty(
      '--current-color',
      ColorTranslator.toRGBA({ h: this.color.h, s: this.color.s, l: this.color.l, a: this.color.a })
    )

    this.value =
      this.color.a < 1
        ? ColorTranslator.toRGBA({
            h: this.color.h,
            s: this.color.s,
            l: this.color.l,
            a: this.color.a,
          })
        : ColorTranslator.toHEX({ h: this.color.h, s: this.color.s, l: this.color.l })
  }

  private track = (event): void => {
    if (this.trackMouseMove) {
      if (event.type === 'mouseup') {
        this.trackMouseMove = false
      }

      const left = Math.max(0, Math.min(event.offsetX, this.el.offsetWidth))
      const top = Math.max(0, Math.min(event.offsetY, 150))
      this.color.s = Math.round((left / this.el.offsetWidth) * 100)
      this.color.l = Math.round((100 - this.color.s / 2) * (1 - top / 150))

      this.setCurrentColor()

      this.pointer.style.setProperty('left', `${left}px`)
      this.pointer.style.setProperty('top', `${top}px`)
    } else if (event.type === 'mousedown') {
      this.trackMouseMove = true
    }
  }

  private setPointer(): void {
    const left = Math.round((this.color.s / 100) * this.el.offsetWidth)
    const top = Math.round((1 - this.color.l / (100 - this.color.s / 2)) * 150)
    this.pointer.style.setProperty('left', `${left}px`)
    this.pointer.style.setProperty('top', `${top}px`)
  }

  private internalValidation = (): boolean => {
    if (this.required && this.value === '') {
      this.error = `This value is required`
    }
    this.valid = this.error === ''
    return this.valid
  }

  private renderColor(): HTMLElement {
    return (
      <div class="color-input__control-wrapper">
        <div class="color-input__control-row">
          <div class="color-input__controls">
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
          <div class="color-input__selected-color"></div>
        </div>
        <div
          class="color-input__shade"
          onMouseDown={this.track}
          onMouseUp={this.track}
          onMouseMove={this.track}
        >
          <div
            ref={(el: HTMLInputElement) => (this.pointer = el)}
            class="color-input__pointer"
          ></div>
        </div>
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
