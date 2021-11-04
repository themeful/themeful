import { newSpecPage } from '@stencil/core/testing'
import { StyleGuideFormComponent } from './style-guide-form.component'

xdescribe('StyleGuideFormComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuideFormComponent],
      html: '<tf-style-guide-form></tf-style-guide-form>',
    })
    expect(root).toEqualHtml(`
      <tf-style-guide-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-style-guide-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuideFormComponent],
      html: `<tf-style-guide-form first="Stencil" last="'Don't call me a framework' JS"></tf-style-guide-form>`,
    })
    expect(root).toEqualHtml(`
      <tf-style-guide-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-style-guide-form>
    `)
  })
})
