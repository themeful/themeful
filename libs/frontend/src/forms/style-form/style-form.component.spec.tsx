import { newSpecPage } from '@stencil/core/testing'
import { StyleFormComponent } from './style-form.component'

xdescribe('StyleFormComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [StyleFormComponent],
      html: '<tf-style-form></tf-style-form>',
    })
    expect(root).toEqualHtml(`
      <tf-style-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-style-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [StyleFormComponent],
      html: `<tf-style-form first="Stencil" last="'Don't call me a framework' JS"></tf-style-form>`,
    })
    expect(root).toEqualHtml(`
      <tf-style-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-style-form>
    `)
  })
})
