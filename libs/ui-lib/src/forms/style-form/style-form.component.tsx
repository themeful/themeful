import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { ExtendedStyle, StyleFormAction, StyleFormData, StyleIdentifier } from '@typings'
import '../../components/button'
import '../../components/inputs/color-input'
import '../../components/inputs/select-input'
import '../../components/inputs/suggest-input'
import '../../components/inputs/text-input'

@Component({
  tag: 'tf-style-form',
  styleUrl: 'style-form.component.scss',
  shadow: true,
})
export class StyleFormComponent {
  /** Data for the form */
  @Prop() formData!: StyleFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<StyleFormAction>

  @State() changed = false
  @State() editMode!: boolean
  @State() type!: string

  private colorControl!: HTMLTfColorInputElement
  private valueControl!: HTMLTfTextInputElement

  private controls: {
    [key: string]:
      | HTMLTfTextInputElement
      | HTMLTfSelectInputElement
      | HTMLTfSuggestInputElement
      | HTMLTfColorInputElement
  } = {}

  public componentWillLoad(): void {
    this.editMode = !!this.formData?.identifier?.style && true
    this.type = this.formData.fields?.type || 'color'
  }

  public componentDidLoad(): void {
    this.action.emit({ action: 'open' })
  }

  private formValues = (): { [key: string]: string | number } => {
    return Object.entries(this.controls).reduce(
      (result: { [key: string]: string | number }, [key, control]) => {
        result[key] = control.value
        return result
      },
      {}
    )
  }

  private changeType = ({ target }: { target: HTMLTfSelectInputElement }) => {
    this.type = (target as HTMLTfSelectInputElement).value as string
    this.controls['value'] = this.type === 'color' ? this.colorControl : this.valueControl
  }

  private validate = (): Promise<boolean> =>
    Promise.all(Object.values(this.controls).map((control) => control.validate())).then(
      (controls) => controls.every((valid) => valid)
    )

  private dirty = (): Promise<boolean> => {
    return Promise.all(Object.values(this.controls).map((control) => control.dirty())).then(
      (controls) => controls.some((valid) => valid)
    )
  }
  private save = async (event: Event): Promise<void> => {
    event.preventDefault()
    this.controls['value'] = this.type === 'color' ? this.colorControl : this.valueControl
    Promise.all([this.dirty(), this.validate()]).then(([dirty, valid]) => {
      if (dirty && valid) {
        if (this.editMode) {
          this.action.emit({
            action: 'update',
            identifier: this.formData.identifier as StyleIdentifier,
            fields: this.formValues() as unknown as ExtendedStyle,
          })
        } else {
          this.action.emit({
            action: 'create',
            identifier: this.formData.identifier as StyleIdentifier,
            fields: this.formValues() as unknown as ExtendedStyle,
          })
        }
      } else if (valid) {
        this.action.emit({ action: 'close' })
      }
    })
  }

  private getHiddenClass = (isColor: boolean): string => {
    return (this.type !== 'color') === isColor ? 'hidden' : ''
  }

  private cancel = (): void => {
    this.action.emit({ action: 'close' })
  }

  private remove = (): void => {
    if (this.editMode) {
      this.action.emit({
        action: 'delete',
        identifier: this.formData.identifier as StyleIdentifier,
      })
    }
  }

  public render(): HTMLTfStyleFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>{this.editMode ? 'Edit' : 'Create'} Style</h3>
        <tf-select-input
          ref={(el: HTMLTfSelectInputElement | undefined) =>
            (this.controls['type'] = el as HTMLTfSelectInputElement)
          }
          label="Type"
          items={this.formData.propertyTypes}
          value={this.formData.fields?.type as string}
          {...{
            onInputChange: this.changeType,
          }}
          required
        />
        <tf-suggest-input
          ref={(el: HTMLTfSuggestInputElement | undefined) =>
            (this.controls['group'] = el as HTMLTfSuggestInputElement)
          }
          label="Group"
          items={this.formData.groups}
          value={this.formData.fields?.group as string}
          minLength={4}
        />
        <tf-text-input
          ref={(el: HTMLTfTextInputElement | undefined) =>
            (this.controls['name'] = el as HTMLTfTextInputElement)
          }
          label="Name"
          value={this.formData.fields?.name as string}
          minLength={3}
        />
        <tf-color-input
          ref={(el: HTMLTfColorInputElement | undefined) =>
            (this.colorControl = el as HTMLTfColorInputElement)
          }
          label="Color"
          required
          class={this.getHiddenClass(true)}
          value={this.formData.fields?.value as string}
        />
        <tf-text-input
          ref={(el: HTMLTfTextInputElement | undefined) =>
            (this.valueControl = el as HTMLTfTextInputElement)
          }
          class={this.getHiddenClass(false)}
          label="Value"
          value={this.formData.fields?.value as string}
          minLength={3}
        />
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
