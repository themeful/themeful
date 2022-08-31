import { newSpecPage } from '@stencil/core/testing'
import { StyleGuideDetailsComponent } from './style-guide-details.component'

describe('StyleGuideDetailsComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuideDetailsComponent],
      html: '<tf-style-guide-details></tf-style-guide-details>',
      url: 'http://localhost/',
    })
    expect(root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuideDetailsComponent],
      html: `<tf-style-guide-details></tf-style-guide-details>`,
      url: 'http://localhost/',
    })
    expect(root).toMatchSnapshot()
  })
})
