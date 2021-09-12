import { newSpecPage } from '@stencil/core/testing'
import { ThemeValueForm } from './theme-value-form'

describe('theme-value-form', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemeValueForm],
      html: '<theme-value-form></theme-value-form>',
    })
    expect(root).toEqualHtml(`
      <theme-value-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </theme-value-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemeValueForm],
      html: `<theme-value-form first="Stencil" last="'Don't call me a framework' JS"></theme-value-form>`,
    })
    expect(root).toEqualHtml(`
      <theme-value-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </theme-value-form>
    `)
  })
})
