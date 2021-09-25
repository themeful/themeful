import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-alias-token-form',
  styleUrl: 'alias-token-form.component.scss',
  shadow: true,
})
export class AliasTokenFormComponent {
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

  public render(): HTMLTfAliasTokenFormElement {
    return <div>Hello, World! {this.getText()}</div>
  }
}
