import { newSpecPage } from '@stencil/core/testing'
import { StyleGuidesComponent } from './style-guides.component'

describe('style-guides component', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuidesComponent],
      html: '<tf-style-guides></tf-style-guides>',
    })
    expect(root).toEqualHtml(`
      <tf-style-guides>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-style-guides>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuidesComponent],
      html: `<tf-style-guides first="Stencil" last="'Don't call me a framework' JS"></tf-style-guides>`,
    })
    expect(root).toEqualHtml(`
      <tf-style-guides first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-style-guides>
    `)
  })
})
