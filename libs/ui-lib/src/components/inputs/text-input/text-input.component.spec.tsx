import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { TextInputComponent } from './text-input.component'

describe('TextInputComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TextInputComponent],
      autoApplyChanges: true,
      template: () => <tf-text-input />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const page = await newSpecPage({
      components: [TextInputComponent],
      autoApplyChanges: true,
      template: () => <tf-text-input label="Some Label" value="Test Text" />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
