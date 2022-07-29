import { newSpecPage } from '@stencil/core/testing'
import { ThemesComponent } from './themes.component'

describe('ThemesComponent', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemesComponent],
      html: '<tf-themes></tf-themes>',
    })
    expect(root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemesComponent],
      html: `<tf-themes></tf-themes>`,
    })
    expect(root).toMatchSnapshot()
  })
})
