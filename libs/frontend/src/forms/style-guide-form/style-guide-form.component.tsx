import { Component, h, Prop } from '@stencil/core'
import { StyleGuideBase } from '@typings'

@Component({
  tag: 'tf-style-guide-form',
  styleUrl: 'style-guide-form.component.scss',
  shadow: true,
})
export class StyleGuideFormComponent {
  /** Data for the form */
  @Prop() formData: StyleGuideBase

  private getText(): string {
    return `${this.formData.name} ${this.formData.baseFontSize}`
  }

  render() {
    return <div>Name / BaseFontSize {this.getText()}</div>
  }
}
