import { newSpecPage } from '@stencil/core/testing'
import { DesignTokenForm } from './design-token-form'

describe('design-token-form', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [DesignTokenForm],
      html: '<design-token-form></design-token-form>',
    })
    expect(root).toEqualHtml(`
      <design-token-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </design-token-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [DesignTokenForm],
      html: `<design-token-form first="Stencil" last="'Don't call me a framework' JS"></design-token-form>`,
    })
    expect(root).toEqualHtml(`
      <design-token-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </design-token-form>
    `)
  })
})
