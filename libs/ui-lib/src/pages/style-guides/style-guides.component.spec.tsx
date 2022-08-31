import { newSpecPage } from '@stencil/core/testing'
import { StyleGuidesComponent } from './style-guides.component'

describe('StyleGuidesComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuidesComponent],
      html: '<tf-style-guides></tf-style-guides>',
      url: 'http://localhost/',
    })
    expect(root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuidesComponent],
      html: `<tf-style-guides></tf-style-guides>`,
      url: 'http://localhost/',
    })
    expect(root).toMatchSnapshot()
  })
})
