import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-style-guides',
  styleUrl: 'style-guides.component.scss',
  shadow: true,
})
export class StyleGuidesComponent {
  /**
   * The first name
   */
  @Prop() first: string

  /**
   * The middle name
   */
  @Prop() middle: string

  /**
   * The last name
   */
  @Prop() last: string

  private getText(): string {
    return `${this.first} ${this.middle} ${this.last}`
  }

  render() {
    return <div>Hello, World! {this.getText()}</div>
  }
}
