import { newSpecPage } from '@stencil/core/testing'
import { TfButton } from './button.component'

describe('tf-button', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [TfButton],
      html: '<tf-button></tf-button>',
    })
    expect(root).toEqualHtml(`
      <tf-button>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-button>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [TfButton],
      html: `<tf-button first="Stencil" last="'Don't call me a framework' JS"></tf-button>`,
    })
    expect(root).toEqualHtml(`
      <tf-button first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-button>
    `)
  })
})
