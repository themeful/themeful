import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-themes',
  styleUrl: 'themes.component.scss',
  shadow: true,
})
export class ThemesComponent {
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
    return <div>Hello, World! m {this.getText()}</div>
  }
}
