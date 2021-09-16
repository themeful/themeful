import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-style-form',
  styleUrl: 'style-form.component.scss',
  shadow: true,
})
export class StyleFormComponent {
  /** The first name */
  @Prop() first: string

  /** The middle name */
  @Prop() middle: string

  /** The last name */
  @Prop() last: string

  private getText(): string {
    return `${this.first} ${this.middle} ${this.last}`
  }

  render() {
    return <div>Hello, World! {this.getText()}</div>
  }
}
