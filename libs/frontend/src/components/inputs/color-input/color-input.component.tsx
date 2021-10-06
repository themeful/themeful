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
    h: 180,
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
  @Prop({ mutable: true }) value: string

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
    console.log("@Watch('value')", this.value)
    if (this.input.value !== this.value) {
      this.input.value = this.value
    }
  }

  public controlsChanged(): void {}

  private updateControls = () => {
    // Alpha
    this.color.a = Math.round(100 - parseInt(this.alpha.value)) / 100

    // Hue
    this.color.h = parseInt(this.base.value)

    // Control colors
    // this.el.style.cssText
    this.el.style.setProperty('--tf-hue-color', `hsl(${this.color.h}, 100%, 50%)`)
    this.el.style.setProperty('--tf-opaque-color', ColorTranslator.toHEX(this.color))
    this.el.style.setProperty('--tf-result-color', ColorTranslator.toRGBA(this.color))
    this.updateInput()
  }

  private updateInput = () => {
    this.value =
      this.color.a < 1
        ? ColorTranslator.toRGBA({
            h: this.color.h,
            s: this.color.s,
            l: this.color.l,
            a: this.color.a,
          })
        : ColorTranslator.toHEX({ h: this.color.h, s: this.color.s, l: this.color.l })
    this.input.value = this.value
    this.inputChanged()
  }

  private setColor(newColor: string): void {
    try {
      let color
      if (newColor?.length >= 3) {
        color = new ColorTranslator(newColor)
      } else {
        color = new ColorTranslator('#00FFFF')
      }
      this.color.a = color.A
      this.color.h = color.H
      this.color.s = color.S
      this.color.l = color.L
      this.base.value = `${this.color.h}`
      this.alpha.value = `${(1 - this.color.a) * 100}`
    } catch {
      this.base.value = '180'
      this.alpha.value = '0'
    }
    this.updateControls()
    this.setPointer()
  }

  private inputChanged = () => {
    this.changed = true
    console.log('inputChanged', this.value, this.input.value)
    if (this.value !== this.input.value) {
      this.setColor(this.input.value)
    }
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

  public componentDidLoad(): void {
    this.setColor(this.value)
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

      this.updateControls()

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

  // =============== RENDER ===============
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
              class="color-input__base"
              onInput={this.updateControls}
            />
            <input
              ref={(el: HTMLInputElement) => (this.alpha = el)}
              type="range"
              min="0"
              max="100"
              class="color-input__alpha"
              onInput={this.updateControls}
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
