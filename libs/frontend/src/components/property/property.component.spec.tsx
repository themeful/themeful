import { newSpecPage } from '@stencil/core/testing'
import { PropertyComponent } from './property.component'

describe('tf-property', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PropertyComponent],
      html: '<tf-property></tf-property>',
    })
    expect(root).toEqualHtml(`
      <tf-property>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-property>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [PropertyComponent],
      html: `<tf-property first="Stencil" last="'Don't call me a framework' JS"></tf-property>`,
    })
    expect(root).toEqualHtml(`
      <tf-property first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-property>
    `)
  })
})
