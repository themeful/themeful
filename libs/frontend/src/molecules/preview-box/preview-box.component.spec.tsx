import { newSpecPage } from '@stencil/core/testing'
import { PreviewBoxComponent } from './preview-box.component'

describe('tf-preview-box', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PreviewBoxComponent],
      html: '<tf-preview-box></tf-preview-box>',
    })
    expect(root).toEqualHtml(`
      <tf-preview-box>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-preview-box>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [PreviewBoxComponent],
      html: `<tf-preview-box first="Stencil" last="'Don't call me a framework' JS"></tf-preview-box>`,
    })
    expect(root).toEqualHtml(`
      <tf-preview-box first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-preview-box>
    `)
  })
})
