import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-theme-form',
  styleUrl: 'theme-form.component.scss',
  shadow: true,
})
export class ThemeFormComponent {
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

  public render() {
    return <div>Hello, World! {this.getText()}</div>
  }
}
