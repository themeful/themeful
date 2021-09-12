import { newSpecPage } from '@stencil/core/testing'
import { ClientForm } from './client-form'

describe('client-form', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ClientForm],
      html: '<client-form></client-form>',
    })
    expect(root).toEqualHtml(`
      <client-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </client-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ClientForm],
      html: `<client-form first="Stencil" last="'Don't call me a framework' JS"></client-form>`,
    })
    expect(root).toEqualHtml(`
      <client-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </client-form>
    `)
  })
})
