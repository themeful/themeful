import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from './button.component'

describe('ButtonComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ButtonComponent],
      autoApplyChanges: true,
      template: () => <tf-button />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const page = await newSpecPage({
      components: [ButtonComponent],
      autoApplyChanges: true,
      template: () => (
        <tf-button type="submit" kind="primary">
          Hello World
        </tf-button>
      ),
    })

    expect(page.root).toMatchSnapshot()
  })
})
