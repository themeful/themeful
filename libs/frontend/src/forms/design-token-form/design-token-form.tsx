import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'design-token-form',
  styleUrl: 'design-token-form.scss',
  shadow: true,
})
export class DesignTokenForm {
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
    return <div>Hello, World! I'm {this.getText()}</div>
  }
}
