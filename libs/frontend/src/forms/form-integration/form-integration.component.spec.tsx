import { newSpecPage } from '@stencil/core/testing'
import { FormIntegrationComponent } from './form-integration.component'

xdescribe('FormIntegrationComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [FormIntegrationComponent],
      html: '<tf-form-integration></tf-form-integration>',
    })
    expect(root).toEqualHtml(`
      <tf-form-integration>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-form-integration>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [FormIntegrationComponent],
      html: `<tf-form-integration first="Stencil" last="'Don't call me a framework' JS"></tf-form-integration>`,
    })
    expect(root).toEqualHtml(`
      <tf-form-integration first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-form-integration>
    `)
  })
})
