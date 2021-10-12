import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core'

@Component({
  tag: 'tf-multi-select-input',
  styleUrl: 'multi-select-input.component.scss',
  shadow: true,
})
export class MultiSelectInputComponent {
  /** Input type */
  @Prop() type = 'text'

  /** Input label */
  @Prop() label: string

  /** Input suggest items */
  @Prop() items: string[] = []

  /** Required input */
  @Prop() required = false

  /** Min input */
  @Prop() minLength: number

  /** Max input */
  @Prop() maxLength: number

  /** Input value */
  @Prop() value: string[] = []

  /** Input Event */
  @Event({ composed: false }) inputChange: EventEmitter

  @State() touched = false
  @State() changed = false
  @State() valid: boolean
  @State() error = ''
  private element: { direction: string; index: number; value: string }

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
    this.changed = true
    this.internalValidation()
    this.touched = true
  }

  private internalValidation = (): boolean => {
    this.error = ''
    if (this.required && this.value.length === 0) {
      this.error = `This value is required`
    } else if ((this.value?.length || 0) < this.minLength) {
      this.error = `The min count is ${this.minLength}`
    } else if (this.value?.length > this.maxLength) {
      this.error = `The max count is ${this.maxLength}`
    }
    this.valid = this.error === ''
    return this.valid
  }

  private allowAdd = (event): void => {
    event.preventDefault()
  }

  private add = (): void => {
    if (this.element.value !== null) {
      this.value = [...this.value, this.element.value]
      this.element.value = null
    }
  }

  private addStart = (index): void => {
    this.element = {
      index,
      direction: 'add',
      value: this.items[index],
    }
    this.items = this.items.filter((_, i) => i !== index)
  }

  private addEnd = (): void => {
    if (this.element.value !== null) {
      this.items = [...this.items, this.element.value]
      this.element.value = null
    }
  }

  private allowRemove = (event): void => {
    event.preventDefault()
  }

  private remove = (): void => {
    if (this.element.value !== null) {
      this.items = [...this.items, this.element.value]
      this.element.value = null
    }
  }

  private removeStart = (index): void => {
    this.element = {
      index,
      direction: 'remove',
      value: this.value[index],
    }
    this.value = this.value.filter((_, i) => i !== index)
  }

  private removeEnd = (): void => {
    if (this.element.value !== null) {
      this.value = [...this.value, this.element.value]
      this.element.value = null
    }
  }

  public render(): HTMLTfMultiSelectInputElement {
    return (
      <Host>
        <label
          class={`multi-select-input${
            this.valid && this.touched ? ' multi-select-input--valid' : ''
          }${!this.valid && this.touched ? ' multi-select-input--error' : ''}`}
        >
          <span class="multi-select-input__label">{this.label}</span>
          <div class="multi-select-input__inputs">
            <div class="multi-select-input__col">
              <h4 class="multi-select-input__list-header">Not Assigned</h4>
              <ul
                {...{
                  class: 'multi-select-input__scroll',
                  onDrop: this.remove,
                  onDragOver: this.allowRemove,
                }}
              >
                {this.items?.map((item, index) => (
                  <li
                    {...{
                      draggable: true,
                      onDragStart: () => {
                        this.addStart(index)
                      },
                      onDragEnd: this.addEnd,
                      key: `${index} ${item}`,
                      class: 'multi-select-input__item',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div class="multi-select-input__col">
              <h4 class="multi-select-input__list-header">Assigned</h4>
              <ul
                {...{
                  class: 'multi-select-input__scroll',
                  onDrop: this.add,
                  onDragOver: this.allowAdd,
                }}
              >
                {this.value?.map((item, index) => (
                  <li
                    {...{
                      draggable: true,
                      onDragStart: () => {
                        this.removeStart(index)
                      },
                      onDragEnd: this.removeEnd,
                      key: `${index} ${item}`,
                      class: 'multi-select-input__item',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p class="multi-select-input__hint">{this.error}</p>
        </label>
      </Host>
    )
  }
}
