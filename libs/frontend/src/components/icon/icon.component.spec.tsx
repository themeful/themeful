import { newSpecPage } from '@stencil/core/testing'
import { IconComponent } from './icon.component'

describe('tf-icon', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [IconComponent],
      html: '<tf-icon></tf-icon>',
    })
    expect(root).toEqualHtml(`
      <tf-icon>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-icon>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [IconComponent],
      html: `<tf-icon first="Stencil" last="'Don't call me a framework' JS"></tf-icon>`,
    })
    expect(root).toEqualHtml(`
      <tf-icon first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-icon>
    `)
  })
})
