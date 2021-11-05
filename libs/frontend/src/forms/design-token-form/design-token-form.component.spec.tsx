import { newSpecPage } from '@stencil/core/testing'
import { DesignTokenFormComponent } from './design-token-form.component'

xdescribe('DesignTokenFormComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [DesignTokenFormComponent],
      html: '<tf-design-token-form></tf-design-token-form>',
    })
    expect(root).toEqualHtml(`
      <tf-design-token-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-design-token-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [DesignTokenFormComponent],
      html: `<tf-design-token-form first="Stencil" last="'Don't call me a framework' JS"></tf-design-token-form>`,
    })
    expect(root).toEqualHtml(`
      <tf-design-token-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-design-token-form>
    `)
  })
})
