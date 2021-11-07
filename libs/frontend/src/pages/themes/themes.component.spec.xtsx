import { newSpecPage } from '@stencil/core/testing'
import { ThemesComponent } from './themes.component'

describe('ThemesComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemesComponent],
      html: '<tf-themes></tf-themes>',
    })
    expect(root).toEqualHtml(`
      <tf-themes>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-themes>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemesComponent],
      html: `<tf-themes first="Stencil" last="'Don't call me a framework' JS"></tf-themes>`,
    })
    expect(root).toEqualHtml(`
      <tf-themes first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-themes>
    `)
  })
})
