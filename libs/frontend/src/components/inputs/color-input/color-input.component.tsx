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
import { combineLatest, distinctUntilChanged, map, Subject, tap, throttleTime } from 'rxjs'

@Component({
  tag: 'tf-color-input',
  styleUrl: 'color-input.component.scss',
  shadow: true,
})
export class ColorInputComponent {
  @State() input: HTMLInputElement
  private alpha: HTMLInputElement
  private hue: HTMLInputElement
  private pointer: HTMLElement
  private trackMouseMove = false
  private tileOffset = { x: 0, y: 0 }

  /** Element */
  @Element() el: HTMLTfColorInputElement

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

  private hue$ = new Subject()
  private alpha$ = new Subject()
  private shade$ = new Subject()
  private input$ = new Subject()

  @Watch('value')
  public valueChanged(): void {
    if (this.input.value !== this.value) {
      this.input.value = this.value
    }
  }

  private setControls(newColor: string): void {
    this.input$.next(this.input.value)
    let color
    try {
      color = new ColorTranslator(newColor)
    } catch {
      color = new ColorTranslator('#00FFFF')
    }
    this.hue.value = `${color.H}`
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
    this.setControls(this.input.value)
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
    this.input$.pipe(throttleTime(50), distinctUntilChanged()).subscribe((value: string) => {
      this.value = value
      this.input.value = this.value
    })

    combineLatest([
      this.hue$.pipe(
        throttleTime(20),
        distinctUntilChanged(),
        map((h: string) => parseInt(h))
      ),
      this.shade$.pipe(
        throttleTime(20),
        distinctUntilChanged((prev: any, curr: any) => prev.x === curr.x && prev.y === curr.y),
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
        throttleTime(20),
        distinctUntilChanged(),
        map((alpha: string) => Math.round(100 - parseInt(alpha)) / 100)
      ),
    ])
      .pipe(
        map(([h, { s, l }, a]) => ({ h, s, l, a })),
        tap((color) => {
          this.el.setAttribute(
            'style',
            `--tf-hue-color: hsl(${color.h}, 100%, 50%); --tf-opaque-color: ${ColorTranslator.toHEX(
              color
            )}; --tf-result-color: ${ColorTranslator.toRGBA(color)};`
          )
        }),
        tap((color) => {
          this.input$.next(
            color.a < 1 ? ColorTranslator.toRGBA(color) : ColorTranslator.toHEX(color)
          )
        })
      )
      .subscribe()

    this.setControls(this.value)
  }

  private trackPointer = (event): void => {
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
      this.trackMouseMove = true
      this.tileOffset.x = event.offsetX - event.clientX
      this.tileOffset.y = event.offsetY - event.clientY
      document.addEventListener('mousemove', this.trackPointer)
      document.addEventListener('mouseup', this.trackPointer)
    }
  }

  private internalValidation = (): boolean => {
    this.error = ''
    if (this.required && this.value === '') {
      this.error = `This value is required`
    } else {
      try {
        new ColorTranslator(this.value)
      } catch {
        this.error = `Please enter a valid color`
      }
    }
    this.valid = this.error === ''
    return this.valid
  }

  // =============== RENDER ===============
  private renderControls(): HTMLElement {
    return (
      <div class="color-input__control-wrapper">
        <div class="color-input__control-row">
          <div class="color-input__controls">
            <input
              {...{
                ref: (hue: HTMLInputElement) => (this.hue = hue),
                type: 'range',
                min: '0',
                max: '360',
                class: 'color-input__hue',
                onInput: (event) => {
                  this.hue$.next((event.target as any).value)
                },
              }}
            />
            <input
              {...{
                ref: (alpha: HTMLInputElement) => (this.alpha = alpha),
                type: 'range',
                min: '0',
                max: '100',
                class: 'color-input__alpha',
                onInput: (event) => {
                  this.alpha$.next((event.target as any).value)
                },
              }}
            />
          </div>
          <div class="color-input__selected-color"></div>
        </div>
        <div
          {...{
            class: 'color-input__shade',
            onMouseDown: this.trackPointer,
          }}
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
            ref={(input: HTMLInputElement) => (this.input = input)}
            class="color-input__input"
            value={this.value}
            type="text"
            onInput={this.inputChanged}
            onBlur={this.blur}
          />
          <p class="color-input__hint">{this.error}</p>
        </label>
        {this.renderControls()}
      </Host>
    )
  }
}
