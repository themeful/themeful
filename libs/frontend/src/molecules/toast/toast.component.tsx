import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-toast',
  styleUrl: 'toast.component.scss',
  shadow: true,
})
export class ToastComponent {
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

  render(): HTMLTfToastElement {
    return <div>Hello, World! I'm {this.getText()}</div>
  }
}
