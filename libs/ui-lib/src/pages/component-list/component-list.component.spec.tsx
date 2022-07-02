import { newSpecPage } from '@stencil/core/testing'
import { ComponentListComponent } from './component-list.component'

describe('ComponentListComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ComponentListComponent],
      html: '<tf-component-list></tf-component-list>',
    })
    expect(root).toEqualHtml(`
      <tf-component-list>
        <mock:shadow-root>
          <stencil-route-title pagetitle="Themeful - Components"></stencil-route-title>
          <tf-navigation size="small"></tf-navigation>
          <div class="component-list__wrapper">
            <table></table>
          </div>
          <tf-form-integration></tf-form-integration>
        </mock:shadow-root>
      </tf-component-list>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ComponentListComponent],
      html: `<tf-component-list></tf-component-list>`,
    })
    expect(root).toEqualHtml(`
      <tf-component-list>
        <mock:shadow-root>
          <stencil-route-title pagetitle="Themeful - Components"></stencil-route-title>
          <tf-navigation size="small"></tf-navigation>
          <div class="component-list__wrapper">
            <table></table>
          </div>
          <tf-form-integration></tf-form-integration>
        </mock:shadow-root>
      </tf-component-list>
    `)
  })
})
