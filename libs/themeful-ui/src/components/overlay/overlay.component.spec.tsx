import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { OverlayComponent } from './overlay.component'

describe('OverlayComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OverlayComponent],
      autoApplyChanges: true,
      template: () => <tf-overlay />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const page = await newSpecPage({
      components: [OverlayComponent],
      autoApplyChanges: true,
      template: () => <tf-overlay>Some content</tf-overlay>,
    })

    expect(page.root).toMatchSnapshot()
  })
})
