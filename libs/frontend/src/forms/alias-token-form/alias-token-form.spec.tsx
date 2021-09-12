import { newSpecPage } from '@stencil/core/testing'
import { AliasTokenForm } from './alias-token-form'

describe('alias-token-form', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [AliasTokenForm],
      html: '<alias-token-form></alias-token-form>',
    })
    expect(root).toEqualHtml(`
      <alias-token-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </alias-token-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [AliasTokenForm],
      html: `<alias-token-form first="Stencil" last="'Don't call me a framework' JS"></alias-token-form>`,
    })
    expect(root).toEqualHtml(`
      <alias-token-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </alias-token-form>
    `)
  })
})
