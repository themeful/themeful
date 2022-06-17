import { newSpecPage } from '@stencil/core/testing'
import { StyleGuideDetailsComponent } from './style-guide-details.component'

describe('StyleGuideDetailsComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuideDetailsComponent],
      html: '<tf-style-guide-details></tf-style-guide-details>',
    })
    expect(root).toEqualHtml(`
      <tf-style-guide-details>
        <mock:shadow-root></mock:shadow-root>
      </tf-style-guide-details>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [StyleGuideDetailsComponent],
      html: `<tf-style-guide-details></tf-style-guide-details>`,
    })
    expect(root).toEqualHtml(`
      <tf-style-guide-details>
        <mock:shadow-root></mock:shadow-root>
      </tf-style-guide-details>
    `)
  })
})
