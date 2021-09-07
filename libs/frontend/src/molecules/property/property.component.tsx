import { properties } from '@properties'
import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'

@Component({
  tag: 'tf-property',
  styleUrl: 'property.component.scss',
  shadow: true,
})
export class PropertyComponent {
  /** The property */
  @Prop() property: any

  /** The section */
  @Prop() section!: string

  /** Show group */
  @Prop() showGroup = true

  /** Show edit button */
  @Prop() showButton = true

  /** Edit event*/
  @Event() edit: EventEmitter

  /** Mapped property */
  @State() mappedProperty: any

  private click = () => this.edit.emit()

  private getName = () => `${this.showGroup ? this.property.group + ' ' : ''}${this.property.name}`

  private getTemplate(): HTMLElement {
    return this.mappedProperty.template(this.property.value)
  }

  componentWillLoad() {
    this.mappedProperty = properties(this.property?.type)
  }

  render(): HTMLTfPropertyElement {
    return (
      <div class="property" style={this.mappedProperty.wrapperStyles}>
        {this.showButton && (
          <tf-button class="property__edit" size="icon" onClick={this.click} title="close">
            <tf-icon icon="pen" />
          </tf-button>
        )}
        {this.getTemplate()}

        {this.property.name && (
          <div class="property__name" style={this.mappedProperty.nameStyles}>
            {this.property?.global && <tf-icon size="small" icon="globe" />}
            <span>{this.getName()}</span>
          </div>
        )}
      </div>
    )
  }
}
