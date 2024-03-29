import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import {
  DesignTokenFormAction,
  DesignTokenFormData,
  DesignTokenFormFields,
  FormValues,
} from '@typings'
import '../../components/button'
import '../../components/inputs/select-input'
import '../../components/inputs/suggest-input'
import '../../components/inputs/text-input'

@Component({
  tag: 'tf-design-token-form',
  styleUrl: 'design-token-form.component.scss',
  shadow: true,
})
export class DesignTokenFormComponent {
  /** Data for the form */
  @Prop() formData!: DesignTokenFormData

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<DesignTokenFormAction>

  @State() changed = false
  @State() editMode!: boolean

  private controls: {
    [key: string]: HTMLTfTextInputElement | HTMLTfSelectInputElement | HTMLTfSuggestInputElement
  } = {}

  public componentWillLoad(): void {
    this.editMode = !!this.formData.identifier && true
  }

  public componentDidLoad(): void {
    this.action.emit({ action: 'open' })
  }

  private formValues = (): FormValues =>
    Object.entries(this.controls).reduce(
      (result: { [key: string]: string | number }, [key, control]) => {
        result[key] = control.value
        return result
      },
      {}
    )

  private validate = (): Promise<boolean> =>
    Promise.all(Object.values(this.controls).map((control) => control.validate())).then(
      (controls) => controls.every((valid) => valid)
    )

  private dirty = (): Promise<boolean> =>
    Promise.all(Object.values(this.controls).map((control) => control.dirty())).then((controls) =>
      controls.some((valid) => valid)
    )

  private save = async (event: Event): Promise<void> => {
    event.preventDefault()
    Promise.all([this.dirty(), this.validate()]).then(([dirty, valid]) => {
      if (dirty && valid) {
        if (this.editMode) {
          this.action.emit({
            action: 'update',
            identifier: this.formData.identifier as string,
            fields: this.formValues() as unknown as DesignTokenFormFields,
          })
        } else {
          this.action.emit({
            action: 'create',
            fields: this.formValues() as unknown as DesignTokenFormFields,
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
      this.action.emit({ action: 'delete', identifier: this.formData?.identifier as string })
    }
  }

  public render(): HTMLTfDesignTokenFormElement {
    return (
      <form class="form" onSubmit={this.save}>
        <h3>{this.editMode ? 'Edit' : 'Create'} Design Token</h3>
        <tf-text-input
          ref={(el: HTMLTfTextInputElement | undefined) =>
            (this.controls['name'] = el as HTMLTfTextInputElement)
          }
          label="Name"
          value={this.formData.fields?.name as string}
          minLength={4}
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
        <tf-select-input
          ref={(el: HTMLTfSelectInputElement | undefined) =>
            (this.controls['type'] = el as HTMLTfSelectInputElement)
          }
          label="Type"
          items={this.formData.propertyTypes}
          value={this.formData.fields?.type as string}
          required
        />
        <tf-text-input
          ref={(el: HTMLTfTextInputElement | undefined) =>
            (this.controls['description'] = el as HTMLTfTextInputElement)
          }
          label="Description"
          value={this.formData.fields?.description as string}
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
