import { newSpecPage } from '@stencil/core/testing'
import { ColorInputComponent } from './color-input.component'

describe('tf-color-input', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ColorInputComponent],
      html: '<tf-color-input />',
    })
    expect(root).toEqualHtml(`
      <tf-color-input>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-color-input>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ColorInputComponent],
      html: `<tf-color-input first="Stencil" last="'Don't call me a framework' JS" />`,
    })
    expect(root).toEqualHtml(`
      <tf-color-input first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-color-input>
    `)
  })
})
