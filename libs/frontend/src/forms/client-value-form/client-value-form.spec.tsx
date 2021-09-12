import { newSpecPage } from '@stencil/core/testing'
import { ClientValueForm } from './client-value-form'

describe('client-value-form', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ClientValueForm],
      html: '<client-value-form></client-value-form>',
    })
    expect(root).toEqualHtml(`
      <client-value-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </client-value-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ClientValueForm],
      html: `<client-value-form first="Stencil" last="'Don't call me a framework' JS"></client-value-form>`,
    })
    expect(root).toEqualHtml(`
      <client-value-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </client-value-form>
    `)
  })
})
