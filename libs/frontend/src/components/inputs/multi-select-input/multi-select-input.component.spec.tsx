import { newSpecPage } from '@stencil/core/testing'
import { MultiSelectInputComponent } from './multi-select-input.component'

describe('tf-multi-select-input', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MultiSelectInputComponent],
      html: '<tf-multi-select-input />',
    })
    expect(root).toEqualHtml(`
      <tf-multi-select-input>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-multi-select-input>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [MultiSelectInputComponent],
      html: `<tf-multi-select-input first="Stencil" last="'Don't call me a framework' JS"></tf-multi-select-input>`,
    })
    expect(root).toEqualHtml(`
      <tf-multi-select-input first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-multi-select-input>
    `)
  })
})
