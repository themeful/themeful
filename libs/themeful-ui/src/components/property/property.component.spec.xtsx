import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { PropertyComponent } from './property.component'

const sample1 = {
  section: 'global',
  extendedStyle: {
    name: null,
    global: false,
    group: 'Very long named nice',
    type: 'color',
    value: '#ff0000',
  },
}

const sample2 = {
  section: 'global',
  extendedStyle: {
    name: 'Background color',
    global: true,
    group: 'Very long named nice',
    type: 'color',
    value: '#ff0000',
  },
}

describe('PropertyComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PropertyComponent],
      autoApplyChanges: true,
      template: () => <tf-property {...sample1} />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const page = await newSpecPage({
      components: [PropertyComponent],
      autoApplyChanges: true,
      template: () => <tf-property {...sample2} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
