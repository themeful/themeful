import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { IconComponent } from './icon.component'

describe('IconComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      autoApplyChanges: true,
      template: () => <tf-icon />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      autoApplyChanges: true,
      template: () => <tf-icon icon="globe" />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
