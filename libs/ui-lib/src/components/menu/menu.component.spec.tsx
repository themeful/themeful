import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { MenuComponent } from './menu.component'

describe('MenuComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MenuComponent],
      autoApplyChanges: true,
      template: () => <tf-menu />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const data = {
      active: 'secondary',
      items: [
        { label: 'Primary', slug: 'primary', selectable: true },
        { label: 'Secondary', slug: 'secondary', selectable: true },
        { label: 'Tertiary', slug: 'tertiary' },
        { label: 'Right', slug: 'right', position: 'right' },
      ],
    }
    const page = await newSpecPage({
      components: [MenuComponent],
      autoApplyChanges: true,
      template: () => <tf-menu {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
