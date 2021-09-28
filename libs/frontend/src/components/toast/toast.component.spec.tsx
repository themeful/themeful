import { newSpecPage } from '@stencil/core/testing'
import { ToastComponent } from './toast.component'

describe('tf-toast', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ToastComponent],
      html: '<tf-toast />',
    })
    expect(root).toEqualHtml(`
      <tf-toast>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-toast>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ToastComponent],
      html: `<tf-toast first="Stencil" last="'Don't call me a framework' JS" />`,
    })
    expect(root).toEqualHtml(`
      <tf-toast first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-toast>
    `)
  })
})
