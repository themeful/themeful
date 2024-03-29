import { Component, Element, Event, EventEmitter, h, Host, Method, Prop } from '@stencil/core'
import { ColorTranslator } from 'colortranslator'
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  sampleTime,
  Subject,
  Subscription,
  tap,
} from 'rxjs'

type ColorFormat = 'HEX' | 'HSL' | 'RGB'

interface RGBObjectGeneric {
  r: number | string
  g: number | string
  b: number | string
  a?: number | string
}

interface HSLObjectGeneric {
  h: number
  s: number | string
  l: number | string
  a?: number
}

interface CMYKObjectGeneric {
  c: number | string
  m: number | string
  y: number | string
  k: number | string
}
type Color = RGBObjectGeneric | HSLObjectGeneric | CMYKObjectGeneric
type ColorInput = string | Color

@Component({
  tag: 'tf-color-input',
  styleUrl: 'color-input.component.scss',
  shadow: true,
})
export class ColorInputComponent {
  private input!: HTMLInputElement
  private alpha!: HTMLInputElement
  private hue!: HTMLInputElement
  private pointer!: HTMLElement
  private trackMouseMove = false
  private tileOffset = { x: 0, y: 0 }
  private changeSource: 'input' | 'controls' = 'input'

  /** Element */
  @Element() el!: HTMLTfColorInputElement

  /** Input label */
  @Prop() label!: string

  /** Required input */
  @Prop() required = false

  /** Input value */
  @Prop({ mutable: true }) value!: string

  /** Input Event */
  @Event({ composed: false }) inputChange!: EventEmitter

  private touched = false
  private changed = false
  private valid!: boolean
  private error = ''

  /** Validate value */
  @Method()
  public async validate(): Promise<boolean> {
    this.touched = true
    this.value = this.value || this.input.value
    return Promise.resolve(this.internalValidation())
  }

  /** Changed value */
  @Method()
  public async dirty(): Promise<boolean> {
    return Promise.resolve(this.changed)
  }

  private format: ColorFormat = 'HEX'
  private hue$ = new Subject<string>()
  private alpha$ = new Subject<string>()
  private shade$ = new Subject<{ x: number; y: number }>()
  private input$ = new Subject<string>()
  private sub = new Subscription()

  private validateColor(color: string): boolean {
    try {
      new ColorTranslator(color)
      return true
    } catch {
      return false
    }
  }

  private setControls(newColor: string): void {
    const color = new ColorTranslator(this.valid ? newColor : 'hsl(180,50%,40%)')
    this.changeSource = 'input'
    this.input$.next(this.input.value as string)
    this.hue.value = Math.round(color.H).toFixed()
    this.alpha.value = `${(1 - color.A) * 100}`
    this.alpha$.next(this.alpha.value)
    this.hue$.next(this.hue.value)
    this.shade$.next({
      x: Math.round((color.S / 100) * this.el.offsetWidth),
      y: Math.round((1 - color.L / (100 - color.S / 2)) * 150),
    })
  }

  private inputChanged = () => {
    this.changed = true
    if ((!this.valid && this.touched) || this.value !== this.input.value) {
      this.value = this.input.value
      this.internalValidation()
    }
    this.setControls(this.value)
  }

  private blur = (): void => {
    this.internalValidation()
    this.touched = true
  }

  public componentWillLoad(): void {
    this.format = this.getFormat(this.value)
    this.valid = this.validateColor(this.value)

    this.sub.add(
      this.input$.pipe(sampleTime(50), distinctUntilChanged()).subscribe((value: string) => {
        this.changed = true
        this.value = value
        this.input.value = value
      })
    )
    this.sub.add(
      this.input$.pipe(debounceTime(200), distinctUntilChanged()).subscribe((value: string) => {
        this.inputChange.emit(value)
      })
    )

    this.sub.add(
      combineLatest([
        this.hue$.pipe(
          sampleTime(25),
          distinctUntilChanged(),
          map((h: string) => parseInt(h))
        ),
        this.shade$.pipe(
          sampleTime(25),
          distinctUntilChanged(
            (prev: { x: number; y: number }, curr: { x: number; y: number }) =>
              prev.x === curr.x && prev.y === curr.y
          ),
          map(({ x, y }) => ({
            left: Math.max(0, Math.min(x, this.el.offsetWidth)),
            top: Math.max(0, Math.min(y, 150)),
          })),
          tap(({ left, top }) => {
            this.pointer.setAttribute('style', `left: ${left}px; top: ${top}px;`)
          }),
          map(({ left, top }) => {
            const s = Math.round((left / this.el.offsetWidth) * 100)
            return {
              s,
              l: Math.round((100 - s / 2) * (1 - top / 150)),
            }
          })
        ),
        this.alpha$.pipe(
          sampleTime(25),
          distinctUntilChanged(),
          map((alpha: string) => Math.round(100 - parseInt(alpha)) / 100)
        ),
      ])
        .pipe(
          map(([h, { s, l }, a]) => ({ h, s, l, a })),
          tap((color) => {
            this.el.setAttribute(
              'style',
              `--tf-hue-color: hsl(${
                color.h
              }, 100%, 50%); --tf-opaque-color: ${ColorTranslator.toHEX(
                color
              )}; --tf-result-color: ${ColorTranslator.toRGBA(color)};`
            )
          }),
          tap((values) => {
            if (this.changeSource === 'controls') {
              this.valid = true
              this.error = ''
              this.setInput(values)
            }
          })
        )
        .subscribe()
    )
  }

  public componentDidLoad(): void {
    this.setControls(this.value)
  }

  public disconnectedCallback(): void {
    this.sub.unsubscribe()
  }

  private setInput = (color: ColorInput): void => {
    const colorObj = new ColorTranslator(color)
    this.input$.next(colorObj[`${this.format}${colorObj.A < 1 ? 'A' : ''}`] as string)
  }

  private toggleFormat = () => {
    this.format = {
      HSL: 'HEX',
      HEX: 'RGB',
      RGB: 'HSL',
    }[this.format] as ColorFormat
    if (this.valid) {
      this.setInput(this.value)
    }
  }

  private getFormat = (color = ''): ColorFormat => {
    const colorStr = color.toLowerCase()

    if (colorStr.includes('hsl')) {
      return 'HSL'
    }
    if (colorStr.includes('rgb')) {
      return 'RGB'
    }
    return 'HEX'
  }

  private trackPointer = (event: MouseEvent): void => {
    if (this.trackMouseMove) {
      if (event.type === 'mouseup') {
        this.trackMouseMove = false
        document.removeEventListener('mousemove', this.trackPointer)
        document.addEventListener('mouseup', this.trackPointer)
      }
      this.shade$.next({
        x: event.clientX + this.tileOffset.x,
        y: event.clientY + this.tileOffset.y,
      })
    } else if (event.type === 'mousedown') {
      this.changeSource = 'controls'
      this.trackMouseMove = true
      this.tileOffset.x = event.offsetX - event.clientX
      this.tileOffset.y = event.offsetY - event.clientY
      document.addEventListener('mousemove', this.trackPointer)
      document.addEventListener('mouseup', this.trackPointer)
    }
  }

  private internalValidation = (): boolean => {
    this.error = ''
    if (this.required && (this.value === '' || this.value === undefined)) {
      this.error = `This value is required`
    } else {
      this.error = this.validateColor(this.value) ? '' : `Please enter a valid color`
    }
    this.valid = this.error === ''
    return this.valid
  }

  private hueChanged = (event: Event) => {
    this.changeSource = 'controls'
    this.hue$.next((event.target as HTMLInputElement).value)
  }

  private alphaChanged = (event: Event) => {
    this.changeSource = 'controls'
    this.alpha$.next((event.target as HTMLInputElement).value)
  }

  // =============== RENDER ===============
  private renderControls(): HTMLElement {
    return (
      <div class="color-input__control-wrapper">
        <div class="color-input__control-row">
          <div class="color-input__controls">
            <input
              ref={(hue: HTMLInputElement | undefined) => (this.hue = hue as HTMLInputElement)}
              onInput={this.hueChanged}
              class="color-input__hue"
              type="range"
              min="0"
              max="360"
            />
            <input
              ref={(alpha: HTMLInputElement | undefined) =>
                (this.alpha = alpha as HTMLInputElement)
              }
              onInput={this.alphaChanged}
              class="color-input__alpha"
              type="range"
              min="0"
              max="100"
            />
          </div>
          <div
            class={`color-input__selected-color${this.valid ? '' : ' no-color'}`}
            onClick={this.toggleFormat}
            title="change format"
          >
            <div class="color-input__crossed-out"></div>
          </div>
        </div>
        <div
          {...{
            class: 'color-input__shade',
            onMouseDown: this.trackPointer,
          }}
        >
          <div
            ref={(el: HTMLDivElement | undefined) => (this.pointer = el as HTMLDivElement)}
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
            ref={(input: HTMLInputElement | undefined) => (this.input = input as HTMLInputElement)}
            class="color-input__input"
            type="text"
            onInput={this.inputChanged}
            onBlur={this.blur}
            value={this.value}
          />
          <p class="color-input__hint">{this.error}</p>
        </label>
        {this.renderControls()}
      </Host>
    )
  }
}
