import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'
import { properties } from '@properties'

@Component({
  tag: 'tf-property',
  styleUrl: 'property.component.scss',
  shadow: true,
})
export class PropertyComponent {
  /** The value */
  @Prop() value: any

  /** The section */
  @Prop() section!: string

  /** Show group */
  @Prop() showGroup = true

  /** Show edit button */
  @Prop() showButton = true

  /** Edit event*/
  @Event() edit: EventEmitter

  private click = () => this.edit.emit()

  private mappedData = () => ({
    value: this.value.value,
    global: this.value.global,
    name: `${this.showGroup ? this.value.group + ' ' : ''}${this.value.name}`
  })

  private getTemplate(): HTMLElement {
    return properties(this.value?.type).template(this.mappedData())
  }

  render(): HTMLTfPropertyElement {
    return (
      <div class='property'>
        {this.showButton && <tf-button class='property__edit' size='icon' onClick={this.click}><tf-icon icon='pen' /></tf-button>}
        {this.getTemplate()}
      </div>
    )
  }
}
