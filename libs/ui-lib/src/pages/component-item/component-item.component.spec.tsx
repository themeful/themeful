import { newSpecPage } from '@stencil/core/testing'
import { ComponentItemComponent } from './component-item.component'

describe('ComponentItemComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ComponentItemComponent],
      html: '<tf-component-item></tf-component-item>',
    })
    expect(root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ComponentItemComponent],
      html: `<tf-component-item></tf-component-item>`,
    })
    expect(root).toMatchSnapshot()
  })
})
