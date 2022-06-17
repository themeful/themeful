import { newSpecPage } from '@stencil/core/testing'
import { ThemefulMicrofrontend } from './themeful.microfrontend'

describe('ThemefulMicrofrontend', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ThemefulMicrofrontend],
      html: '<themeful-microfrontend></themeful-microfrontend>',
    })
    expect(root).toEqualHtml(`
      <themeful-microfrontend>
        <mock:shadow-root>
          <header>
            <stencil-route-link url="/themes">
              <img class="logo" src="/assets/themeful.svg">
            </stencil-route-link>
            <div class="navigation">
              <h1>
                Themeful
              </h1>
              <nav class="button-group nav-row">
                <stencil-route-link url="/themes">
                  <tf-button kind="selectable">
                    Themes
                  </tf-button>
                </stencil-route-link>
                <stencil-route-link url="/styleguides">
                  <tf-button kind="selectable">
                    Style Guides
                  </tf-button>
                </stencil-route-link>
                <stencil-route-link url="/components">
                  <tf-button kind="selectable">
                    Components
                  </tf-button>
                </stencil-route-link>
                <tf-button class="mode-toggle" kind="selectable">
                  Light Mode
                </tf-button>
              </nav>
            </div>
            <tf-toast></tf-toast>
          </header>
          <main>
            <stencil-router>
              <stencil-route-switch scrolltopoffset="0">
                <stencil-route component="tf-themes" url="/themes"></stencil-route>
                <stencil-route component="tf-style-guides" url="/styleguides"></stencil-route>
                <stencil-route component="tf-style-guide-details" url="/styleguide/:slug"></stencil-route>
                <stencil-route component="tf-components" url="/components"></stencil-route>
                <stencil-route exact="" url="/">
                  <stencil-router-redirect url="/themes"></stencil-router-redirect>
                </stencil-route>
              </stencil-route-switch>
            </stencil-router>
          </main>
        </mock:shadow-root>
      </themeful-microfrontend>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ThemefulMicrofrontend],
      html: `<themeful-microfrontend></themeful-microfrontend>`,
    })
    expect(root).toEqualHtml(`
      <themeful-microfrontend>
        <mock:shadow-root>
        <header>
          <stencil-route-link url="/themes">
            <img class="logo" src="/assets/themeful.svg">
          </stencil-route-link>
          <div class="navigation">
            <h1>
              Themeful
            </h1>
            <nav class="button-group nav-row">
              <stencil-route-link url="/themes">
                <tf-button kind="selectable">
                  Themes
                </tf-button>
              </stencil-route-link>
              <stencil-route-link url="/styleguides">
                <tf-button kind="selectable">
                  Style Guides
                </tf-button>
              </stencil-route-link>
              <stencil-route-link url="/components">
                <tf-button kind="selectable">
                  Components
                </tf-button>
              </stencil-route-link>
              <tf-button class="mode-toggle" kind="selectable">
                Light Mode
              </tf-button>
            </nav>
          </div>
          <tf-toast></tf-toast>
        </header>
        <main>
          <stencil-router>
            <stencil-route-switch scrolltopoffset="0">
              <stencil-route component="tf-themes" url="/themes"></stencil-route>
              <stencil-route component="tf-style-guides" url="/styleguides"></stencil-route>
              <stencil-route component="tf-style-guide-details" url="/styleguide/:slug"></stencil-route>
              <stencil-route component="tf-components" url="/components"></stencil-route>
              <stencil-route exact="" url="/">
                <stencil-router-redirect url="/themes"></stencil-router-redirect>
              </stencil-route>
            </stencil-route-switch>
          </stencil-router>
        </main>
        </mock:shadow-root>
      </themeful-microfrontend>
    `)
  })
})
