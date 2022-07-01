import { newSpecPage } from '@stencil/core/testing'
import { ComponentItemComponent } from './component-item.component'

describe('ComponentItemComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ComponentItemComponent],
      html: '<tf-component-item></tf-component-item>',
    })
    expect(root).toEqualHtml(`
      <tf-component-item>
        <mock:shadow-root>
          <stencil-route-title pagetitle="Themeful - Themes"></stencil-route-title>
          <tf-navigation size="small"></tf-navigation>
          <div class="design-tokens__wrapper">
            <table class="design-tokens">
              <tbody></tbody>
            </table>
          </div>
          <tf-form-integration></tf-form-integration>
        </mock:shadow-root>
      </tf-component-item>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ComponentItemComponent],
      html: `<tf-component-item></tf-component-item>`,
    })
    expect(root).toEqualHtml(`
      <tf-component-item>
        <mock:shadow-root>
          <stencil-route-title pagetitle="Themeful - Themes"></stencil-route-title>
          <tf-navigation size="small"></tf-navigation>
          <div class="design-tokens__wrapper">
            <table class="design-tokens">
              <tbody></tbody>
            </table>
          </div>
        <tf-form-integration></tf-form-integration>
        </mock:shadow-root>
      </tf-component-item>
    `)
  })
})
