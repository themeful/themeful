import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ColorInputComponent } from './color-input.component'

describe('ColorInputComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ColorInputComponent],
      autoApplyChanges: true,
      template: () => <tf-color-input />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const page = await newSpecPage({
      components: [ColorInputComponent],
      autoApplyChanges: true,
      template: () => <tf-color-input label="Some color" value="#d920c1" />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
