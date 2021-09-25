import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-theme-value-form',
  styleUrl: 'theme-value-form.component.scss',
  shadow: true,
})
export class ThemeValueFormComponent {
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

  public render(): HTMLTfThemeValueFormElement {
    return <div>Hello, World! {this.getText()}</div>
  }
}
