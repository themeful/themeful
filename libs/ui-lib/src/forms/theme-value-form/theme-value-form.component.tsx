import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import {
  DirectValue,
  ThemeValueFormAction,
  ThemeValueFormData,
  ThemeValueIdentifier,
  ThemeValueReturnFields,
} from '@typings'
import '../../components/button'
import '../../components/inputs/color-input'
import '../../components/inputs/select-input'
import '../../components/inputs/text-input'
import '../../components/property'

@Component({
  tag: 'tf-theme-value-form',
  styleUrl: 'theme-value-form.component.scss',
  shadow: true,
})
export class ThemeValueFormComponent {
  /** Data for the form */
  @Prop() formData!: ThemeValueFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<ThemeValueFormAction>

  @State() changed = false
  @State() editMode!: boolean
  @State() type!: string
  @State() selected = ''
  @State() toggle: 'style' | 'direct' = 'style'

  private controls: {
    [key: string]: HTMLTfTextInputElement | HTMLTfSelectInputElement | HTMLTfColorInputElement
  } = {}

  public componentWillLoad(): void {
    this.editMode = !!this.formData?.identifier?.media && true
    this.type = this.formData.type
    this.toggle = this.formData.fields?.direct ? 'direct' : 'style'
    if (this.toggle === 'style') {
      this.selected = this.formData.fields?.style as string
    }
  }

  public componentDidLoad(): void {
    this.action.emit({ action: 'open' })
  }

  private formValues = (): ThemeValueReturnFields => {
    const values = Object.entries(this.controls).reduce(
      (result: { [key: string]: string }, [key, control]) => {
        result[key] = control.value as string
        return result
      },
      {}
    )
    if (this.toggle === 'style') {
      return {
        media: values['media'],
        style: this.selected,
      }
    } else {
      return {
        media: values['media'],
        direct: {
          value: values['direct'],
          type: this.type,
        } as DirectValue,
      }
    }
  }

  private validate = (): Promise<boolean> => {
    const styleValidation = this.toggle !== 'style' || this.selected !== ''
    return Promise.all([
      ...Object.values(this.controls).map((control) => control.validate()),
      Promise.resolve(styleValidation),
    ]).then((controls) => controls.every((valid) => valid))
  }

  private dirty = (): Promise<boolean> => {
    const styleValidation = this.toggle !== 'style' || this.changed
    return Promise.all([
      Object.values(this.controls).map((control) => control.dirty()),
      Promise.resolve(styleValidation),
    ]).then((controls) => controls.some((valid) => valid))
  }

  private select = (key: string) => {
    this.changed = true
    this.selected = key
  }

  private save = async (event: Event): Promise<void> => {
    event.preventDefault()
    Promise.all([this.dirty(), this.validate()]).then(([dirty, valid]) => {
      if (dirty && valid) {
        if (this.editMode) {
          this.action.emit({
            action: 'update',
            identifier: this.formData.identifier as ThemeValueIdentifier,
            fields: this.formValues(),
          })
        } else {
          this.action.emit({
            action: 'create',
            identifier: this.formData.identifier as ThemeValueIdentifier,
            fields: this.formValues(),
          })
        }
      } else if (valid) {
        this.action.emit({ action: 'close' })
      }
    })
  }

  private cancel = (): void => {
    this.action.emit({ action: 'close' })
  }

  private remove = (): void => {
    if (this.editMode) {
      this.action.emit({
        action: 'delete',
        identifier: this.formData.identifier as ThemeValueIdentifier,
      })
    }
  }

  public render(): HTMLTfThemeValueFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>{this.editMode ? 'Edit' : 'Create'} Theme Value</h3>
        <tf-select-input
          ref={(el: HTMLTfSelectInputElement | undefined) =>
            (this.controls['media'] = el as HTMLTfSelectInputElement)
          }
          label="Media"
          items={this.formData.medias.map(({ key, value }) => ({
            key,
            value: `${key.startsWith('global_') ? '(G) ' : ''}${value}`,
          }))}
          value={this.formData.fields?.media as string}
          required
        />
        <div class="button-group">
          <tf-button
            kind="selectable"
            class={`button-group--first${this.toggle === 'style' ? ' active' : ''}`}
            active={this.toggle === 'style'}
            {...{
              onClick: () => {
                this.toggle = 'style'
              },
            }}
          >
            Style Guide
          </tf-button>
          <tf-button
            kind="selectable"
            class={`button-group--last${this.toggle === 'direct' ? ' active' : ''}`}
            active={this.toggle === 'direct'}
            {...{
              onClick: () => {
                this.toggle = 'direct'
              },
            }}
          >
            Direct Value
          </tf-button>
        </div>

        {this.toggle === 'direct' &&
          (this.type === 'color' ? (
            <tf-color-input
              ref={(el: HTMLTfColorInputElement | undefined) =>
                this.type === 'color'
                  ? (this.controls['direct'] = el as HTMLTfColorInputElement)
                  : (el as HTMLTfColorInputElement)
              }
              label="Color"
              required
              value={this.formData.fields?.direct as string}
            />
          ) : (
            <tf-text-input
              ref={(el: HTMLTfTextInputElement | undefined) =>
                this.type !== 'color'
                  ? (this.controls['direct'] = el as HTMLTfTextInputElement)
                  : (el as HTMLTfTextInputElement)
              }
              label="Value"
              value={this.formData.fields?.direct as string}
              required
            />
          ))}
        {this.toggle === 'style' && (
          <ul class="form__row--span form__selectable-list property--selectable">
            {Object.entries(this.formData.styles).map(([key, style]) => (
              <li
                {...{
                  class: 'form__selectable',
                  onClick: () => this.select(key),
                }}
              >
                <tf-property
                  extendedStyle={style}
                  class={key === this.selected ? 'property--selected' : ''}
                />
              </li>
            ))}
          </ul>
        )}
        <div class="form__controls">
          {this.editMode && (
            <tf-button kind="danger" onClick={this.remove}>
              Delete
            </tf-button>
          )}
          <tf-button kind="secondary" onClick={this.cancel}>
            Cancel
          </tf-button>
          <tf-button kind="primary" onClick={this.save} type="submit">
            Save
          </tf-button>
        </div>
      </form>
    )
  }
}
