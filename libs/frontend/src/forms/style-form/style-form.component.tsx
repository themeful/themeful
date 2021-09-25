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

  // All used Groups -> Name Slug
  // all Types -> Name Slug

  public render(): HTMLTfStyleFormElement {
    return <div>Type, Name, Group, Value {this.getText()}</div>
  }
}
