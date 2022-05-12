import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { SelectInputComponent } from './select-input.component'

describe('SelectInputComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SelectInputComponent],
      autoApplyChanges: true,
      template: () => <tf-select-input />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const items = [
      { key: '', value: '-' },
      { key: 'first', value: 'First Value' },
      { key: 'second', value: 'Second Value' },
    ]
    const page = await newSpecPage({
      components: [SelectInputComponent],
      autoApplyChanges: true,
      template: () => <tf-select-input label="Some Label" value="second" items={items} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
