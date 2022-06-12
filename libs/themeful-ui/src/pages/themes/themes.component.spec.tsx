import { newSpecPage } from '@stencil/core/testing'
import { ThemesComponent } from './themes.component'

describe('ThemesComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemesComponent],
      html: '<tf-themes></tf-themes>',
    })
    expect(root).toEqualHtml(`
      <tf-themes>
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
      </tf-themes>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemesComponent],
      html: `<tf-themes></tf-themes>`,
    })
    expect(root).toEqualHtml(`
      <tf-themes>
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
      </tf-themes>
    `)
  })
})
