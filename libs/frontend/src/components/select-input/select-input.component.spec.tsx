import { newSpecPage } from '@stencil/core/testing'
import { SelectInputComponent } from './select-input.component'

describe('tf-select-input', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SelectInputComponent],
      html: '<tf-select-input />',
    })
    expect(root).toEqualHtml(`
      <tf-select-input>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-select-input>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [SelectInputComponent],
      html: `<tf-select-input first="Stencil" last="'Don't call me a framework' JS"></tf-select-input>`,
    })
    expect(root).toEqualHtml(`
      <tf-select-input first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-select-input>
    `)
  })
})
