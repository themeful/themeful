import { newSpecPage } from '@stencil/core/testing'
import { ComponentListComponent } from './component-list.component'

describe('ComponentListComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ComponentListComponent],
      html: '<tf-component-list></tf-component-list>',
    })
    expect(root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ComponentListComponent],
      html: `<tf-component-list></tf-component-list>`,
    })
    expect(root).toMatchSnapshot()
  })
})
