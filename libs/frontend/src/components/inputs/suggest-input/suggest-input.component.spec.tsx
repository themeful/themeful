import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { SuggestInputComponent } from './suggest-input.component'

describe('SuggestInputComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SuggestInputComponent],
      autoApplyChanges: true,
      template: () => <tf-suggest-input />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const items = ['First Value', 'Second Value']
    const page = await newSpecPage({
      components: [SuggestInputComponent],
      autoApplyChanges: true,
      template: () => <tf-suggest-input label="Some Label" value="Test Text" items={items} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
