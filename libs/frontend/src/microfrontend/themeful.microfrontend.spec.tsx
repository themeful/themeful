import { newSpecPage } from '@stencil/core/testing'
import { ThemefulMicrofrontend } from './themeful.microfrontend'

xdescribe('ThemefulMicrofrontend', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemefulMicrofrontend],
      html: '<themeful-microfrontend></themeful-microfrontend>',
    })
    expect(root).toEqualHtml(`
      <themeful-microfrontend>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </themeful-microfrontend>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemefulMicrofrontend],
      html: `<themeful-microfrontend first="Stencil" last="'Don't call me a framework' JS"></themeful-microfrontend>`,
    })
    expect(root).toEqualHtml(`
      <themeful-microfrontend first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </themeful-microfrontend>
    `)
  })
})
