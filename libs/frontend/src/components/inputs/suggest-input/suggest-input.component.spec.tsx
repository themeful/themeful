import { newSpecPage } from '@stencil/core/testing'
import { SuggestInputComponent } from './suggest-input.component'

describe('tf-suggest-input', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SuggestInputComponent],
      html: '<tf-suggest-input />',
    })
    expect(root).toEqualHtml(`
      <tf-suggest-input>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-suggest-input>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [SuggestInputComponent],
      html: `<tf-suggest-input first="Stencil" last="'Don't call me a framework' JS" />`,
    })
    expect(root).toEqualHtml(`
      <tf-suggest-input first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-suggest-input>
    `)
  })
})
