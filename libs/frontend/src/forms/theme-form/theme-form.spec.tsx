import { newSpecPage } from '@stencil/core/testing'
import { ThemeForm } from './theme-form'

describe('theme-form', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemeForm],
      html: '<theme-form></theme-form>',
    })
    expect(root).toEqualHtml(`
      <theme-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </theme-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemeForm],
      html: `<theme-form first="Stencil" last="'Don't call me a framework' JS"></theme-form>`,
    })
    expect(root).toEqualHtml(`
      <theme-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </theme-form>
    `)
  })
})
