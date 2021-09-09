import { newSpecPage } from '@stencil/core/testing'
import { ThemefulComponent } from './themeful.microfrontend'

describe('themeful-component', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemefulComponent],
      html: '<themeful-component></themeful-component>',
    })
    expect(root).toEqualHtml(`
      <themeful-component>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </themeful-component>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemefulComponent],
      html: `<themeful-component first="Stencil" last="'Don't call me a framework' JS"></themeful-component>`,
    })
    expect(root).toEqualHtml(`
      <themeful-component first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </themeful-component>
    `)
  })
})
