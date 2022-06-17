import { Component, h, Host, State } from '@stencil/core'
import '@ui'
import '@ui/components/button'
import '@ui/components/toast'
import '@ui/pages/components'
import '@ui/pages/style-guide-details'
import '@ui/pages/style-guides'
import '@ui/pages/themes'
import { APIService } from '../services'

@Component({
  tag: 'themeful-microfrontend',
  styleUrl: 'themeful.microfrontend.scss',
  shadow: true,
})
export class ThemefulMicrofrontend {
  private apiService: APIService
  private styleGuides$
  private bundle$
  private toast$
  @State() mode: string

  constructor() {
    this.apiService = APIService.Instance
    this.styleGuides$ = this.apiService.styleGuides$
    this.bundle$ = this.apiService.bundle$
    this.toast$ = this.apiService.toast$
  }

  private onAction = ({ detail }) => {
    if (!['open', 'close'].includes(detail.action)) {
      this.apiService.action(detail).subscribe((result) => {
        this.toast$.next({
          text: result ? 'Updated' : 'Something went wrong',
          status: result ? 'success' : 'error',
        })
      })
    }
  }

  private toogleMode = () => {
    document.body.classList.toggle('tf-light')
    this.checkMode()
  }

  private checkMode = () => {
    this.mode = document.body.classList.contains('tf-light') ? 'light' : 'dark'
  }

  public componentWillLoad(): void {
    this.checkMode()
  }

  public render(): HTMLThemefulMicrofrontendElement {
    return (
      <Host>
        <header>
          <stencil-route-link url="/themes">
            <img class="logo" src="/assets/themeful.svg" />
          </stencil-route-link>
          <div class="navigation">
            <h1>Themeful</h1>
            <nav class="button-group nav-row">
              <stencil-route-link url="/themes">
                <tf-button kind="selectable">Themes</tf-button>
              </stencil-route-link>
              <stencil-route-link url="/styleguides">
                <tf-button kind="selectable">Style Guides</tf-button>
              </stencil-route-link>
              <stencil-route-link url="/components">
                <tf-button kind="selectable">Components</tf-button>
              </stencil-route-link>
              <tf-button class="mode-toggle" onClick={this.toogleMode} kind="selectable">
                {this.mode === 'light' ? 'Dark' : 'Light'} Mode
              </tf-button>
            </nav>
          </div>

          <tf-toast {...{ msg$: this.toast$ }} />
        </header>
        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route
                url="/themes"
                component="tf-themes"
                componentProps={{
                  bundle$: this.bundle$,
                  onAction: this.onAction,
                }}
              />
              <stencil-route
                url="/styleguides"
                component="tf-style-guides"
                componentProps={{
                  styleGuides$: this.styleGuides$,
                  onAction: this.onAction,
                }}
              />
              <stencil-route
                url="/styleguide/:slug"
                component="tf-style-guide-details"
                componentProps={{
                  styleGuides$: this.styleGuides$,
                  onAction: this.onAction,
                }}
              />
              <stencil-route
                url="/components"
                component="tf-components"
                componentProps={{
                  onAction: this.onAction,
                }}
              />
              <stencil-route url="/" exact={true}>
                <stencil-router-redirect url="/themes" />
              </stencil-route>
            </stencil-route-switch>
          </stencil-router>
        </main>
      </Host>
    )
  }
}
