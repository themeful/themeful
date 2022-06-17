import { newSpecPage } from '@stencil/core/testing'
import { ComponentsComponent } from './components.component'

describe('ComponentsComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ComponentsComponent],
      html: '<tf-components></tf-components>',
    })
    expect(root).toEqualHtml(`
      <tf-components>
        <mock:shadow-root>
          <stencil-route-title pagetitle="Themeful - Components"></stencil-route-title>
          <tf-navigation size="small"></tf-navigation>
          List of Components
          <tf-form-integration></tf-form-integration>
        </mock:shadow-root>
      </tf-components>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ComponentsComponent],
      html: `<tf-components></tf-components>`,
    })
    expect(root).toEqualHtml(`
      <tf-components>
        <mock:shadow-root>
          <stencil-route-title pagetitle="Themeful - Components"></stencil-route-title>
          <tf-navigation size="small"></tf-navigation>
          List of Components
        <tf-form-integration></tf-form-integration>
        </mock:shadow-root>
      </tf-components>
    `)
  })
})
