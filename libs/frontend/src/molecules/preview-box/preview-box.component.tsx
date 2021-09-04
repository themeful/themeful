import { Component, h, Prop } from '@stencil/core'
import { properties } from '@properties'

@Component({
  tag: 'tf-preview-box',
  styleUrl: 'preview-box.component.scss',
  shadow: true,
})
export class PreviewBoxComponent {
  /** The type */
  @Prop() type: string

  /** Some data */
  @Prop() data: string = 'My Name'

  private defaultTemplate(name): HTMLElement {
    return <div> Default Box {name}</div>
  }

  private getTemplate(): HTMLElement {
    return properties[this.type]?.template(this.data) ?? this.defaultTemplate(this.data)
  }

  render(): HTMLTfPreviewBoxElement {
    return <div>
      {this.getTemplate()}
      </div>
  }
}
