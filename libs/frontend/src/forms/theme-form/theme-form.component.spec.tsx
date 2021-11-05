import { newSpecPage } from '@stencil/core/testing'
import { ThemeFormComponent } from './theme-form.component'

xdescribe('ThemeFormComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemeFormComponent],
      html: '<tf-theme-form></tf-theme-form>',
    })
    expect(root).toEqualHtml(`
      <tf-theme-form>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-theme-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemeFormComponent],
      html: `<tf-theme-form first="Stencil" last="'Don't call me a framework' JS"></tf-theme-form>`,
    })
    expect(root).toEqualHtml(`
      <tf-theme-form first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-theme-form>
    `)
  })
})
