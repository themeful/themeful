import { newSpecPage } from '@stencil/core/testing'
import { ThemeValueFormComponent } from './theme-value-form.component'

xdescribe('ThemeValueFormComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemeValueFormComponent],
      html: '<tf-theme-value-form></tf-theme-value-form>',
    })
    expect(root).toEqualHtml(`
      <tf-theme-value-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-theme-value-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemeValueFormComponent],
      html: `<tf-theme-value-form first="Stencil" last="'Don't call me a framework' JS"></tf-theme-value-form>`,
    })
    expect(root).toEqualHtml(`
      <tf-theme-value-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-theme-value-form>
    `)
  })
})
