import { newSpecPage } from '@stencil/core/testing'
import { ThemefulMicrofrontend } from './themeful.microfrontend'

describe('ThemefulMicrofrontend', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemefulMicrofrontend],
      html: '<themeful-microfrontend></themeful-microfrontend>',
    })
    expect(root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemefulMicrofrontend],
      html: `<themeful-microfrontend></themeful-microfrontend>`,
    })
    expect(root).toMatchSnapshot()
  })
})
