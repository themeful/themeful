import { newSpecPage } from '@stencil/core/testing'
import { TextInputComponent } from './text-input.component'

describe('tf-text-input', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [TextInputComponent],
      html: '<tf-text-input></tf-text-input>',
    })
    expect(root).toEqualHtml(`
      <tf-text-input>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-text-input>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [TextInputComponent],
      html: `<tf-text-input first="Stencil" last="'Don't call me a framework' JS"></tf-text-input>`,
    })
    expect(root).toEqualHtml(`
      <tf-text-input first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-text-input>
    `)
  })
})
