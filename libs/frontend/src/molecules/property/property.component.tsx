import { properties } from '@properties'
import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'

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

  private click = () => this.edit.emit()

  private getName = () => `${this.showGroup ? this.property.group + ' ' : ''}${this.property.name}`

  private getTemplate(): HTMLElement {
    return properties(this.property?.type).template(this.property.value)
  }

  render(): HTMLTfPropertyElement {
    return (
      <div class="property">
        {this.showButton && (
          <tf-button class="property__edit" size="icon" onClick={this.click}>
            <tf-icon icon="pen" />
          </tf-button>
        )}
        {this.getTemplate()}

        {this.property.name && (
          <div class="property__name" style={{}}>
            {this.property?.global && <tf-icon size="small" icon="globe" />}
            <span>{this.getName()}</span>
          </div>
        )}
      </div>
    )
  }
}
