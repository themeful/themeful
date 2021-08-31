import { newSpecPage } from '@stencil/core/testing'
import { PreviewBox } from './preview-box'

describe('preview-box', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PreviewBox],
      html: '<preview-box></preview-box>',
    })
    expect(root).toEqualHtml(`
      <preview-box>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </preview-box>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [PreviewBox],
      html: `<preview-box first="Stencil" last="'Don't call me a framework' JS"></preview-box>`,
    })
    expect(root).toEqualHtml(`
      <preview-box first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </preview-box>
    `)
  })
})
