import { getProperty } from '@properties'
import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { ExtendedStyle, PropertyType } from '@typings'
import '../button'
import '../icon'

@Component({
  tag: 'tf-property',
  styleUrl: 'property.component.scss',
  shadow: true,
})
export class PropertyComponent {
  /** The extendedStyle */
  @Prop() extendedStyle!: ExtendedStyle

  /** Show group */
  @Prop() showGroup? = true

  /** Edit event*/
  @Event({ composed: false }) edit!: EventEmitter

  /** Mapped property */
  @State() mappedProperty!: PropertyType

  private click = () => this.edit.emit()

  private getName = () =>
    `${this.showGroup ? this.extendedStyle.group + ' ' : ''}${this.extendedStyle.name}`

  private getTemplate(): HTMLElement {
    return this.mappedProperty.template(this.extendedStyle.value)
  }

  public componentWillLoad(): void {
    this.mappedProperty = getProperty(this.extendedStyle?.type)
  }

  public render(): HTMLTfPropertyElement {
    return (
      <div class="property" style={this.mappedProperty.styles.wrapper}>
        <tf-button class="property__edit" size="icon" onClick={this.click} title="edit style">
          <tf-icon icon="pen" />
        </tf-button>
        {this.getTemplate()}

        {this.extendedStyle?.name && (
          <div class="property__name" style={this.mappedProperty.styles.name}>
            {this.extendedStyle?.global && <tf-icon size="small" icon="globe" />}
            <span>{this.getName()}</span>
          </div>
        )}
      </div>
    )
  }
}
