import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { MultiSelectInputComponent } from './multi-select-input.component'

describe('MultiSelectInputComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MultiSelectInputComponent],
      autoApplyChanges: true,
      template: () => <tf-multi-select-input />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const data = {
      label: 'First',
      value: ['Second Value', 'Fourth Value'],
      items: ['First Value', 'Third Value'],
    }
    const page = await newSpecPage({
      components: [MultiSelectInputComponent],
      autoApplyChanges: true,
      template: () => <tf-multi-select-input {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
