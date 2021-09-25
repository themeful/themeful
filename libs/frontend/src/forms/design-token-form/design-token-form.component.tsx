import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-design-token-form',
  styleUrl: 'design-token-form.component.scss',
  shadow: true,
})
export class DesignTokenFormComponent {
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

  public render(): HTMLTfDesignTokenFormElement {
    return <div>Hello, World! {this.getText()}</div>
  }
}
