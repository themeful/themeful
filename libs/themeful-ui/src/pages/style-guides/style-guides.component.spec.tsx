import { newSpecPage } from '@stencil/core/testing'
import { StyleGuidesComponent } from './style-guides.component'

describe('StyleGuidesComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuidesComponent],
      html: '<tf-style-guides></tf-style-guides>',
    })
    expect(root).toEqualHtml(`
      <tf-style-guides>
        <mock:shadow-root>
          <stencil-route-title pagetitle="Themeful - Style Guides"></stencil-route-title>
          <tf-navigation size="small"></tf-navigation>
          <div class="style-guide__wrapper"></div>
          <tf-form-integration></tf-form-integration>
        </mock:shadow-root>
      </tf-style-guides>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuidesComponent],
      html: `<tf-style-guides></tf-style-guides>`,
    })
    expect(root).toEqualHtml(`
      <tf-style-guides>
        <mock:shadow-root>
          <stencil-route-title pagetitle="Themeful - Style Guides"></stencil-route-title>
          <tf-navigation size="small"></tf-navigation>
          <div class="style-guide__wrapper"></div>
          <tf-form-integration></tf-form-integration>
        </mock:shadow-root>
      </tf-style-guides>
    `)
  })
})
