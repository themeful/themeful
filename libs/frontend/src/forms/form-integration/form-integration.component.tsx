import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'tf-form-integration',
  styleUrl: 'form-integration.component.scss',
  shadow: true,
})
export class FormIntegrationComponent {
  /**
   * Show overlay with form
   */
  @Prop() show = false

  /**
   * The middle name
   */
  @Prop() formData: any

  /**
   * The last name
   */
  // @Prop() last: string

  // private getText(): string {
  //   return `${this.first} ${this.middle} ${this.last}`
  // }

  // args: {
  //   newMode: {
  //     formData: {
  //       baseFontSize: 16,
  //     },
  //   },
  //   editMode: {
  //     styleGuide: 'styleGuide1',
  //     formData: {
  //       name: 'StyleGuide Name',
  //       baseFontSize: 16,
  //     },
  //   },
  // },

  private close = (): void => {
    this.show = false
  }

  render() {
    console.log(this.formData, this.show)
    return (
      <tf-overlay show={this.show}>
        {this.formData && (
          <tf-style-guide-form
            {...{ formData: this.formData, onClose: this.close }}
          ></tf-style-guide-form>
        )}
      </tf-overlay>
    )
  }
}
