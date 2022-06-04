import { Component, h, Host, State } from '@stencil/core'
import { APIService } from '@themeful-ui'

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
    this.styleGuides$ = this.apiService.styleGuides
    this.bundle$ = this.apiService.bundle
    this.toast$ = this.apiService.toast
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
          <div class="logo-bar">
            <img class="logo" src="/assets/themeful.svg" />
            <h1>Themeful</h1>
          </div>
          <nav class="button-group nav-row">
            <stencil-route-link url="/themes">
              <tf-button kind="selectable">Themes</tf-button>
            </stencil-route-link>
            <stencil-route-link url="/styleguides">
              <tf-button kind="selectable">Style Guides</tf-button>
            </stencil-route-link>
            <tf-button class="mode-toggle" onClick={this.toogleMode} kind="selectable">
              {this.mode === 'light' ? 'Dark' : 'Light'} Mode
            </tf-button>
          </nav>
        </header>
        <tf-toast {...{ msg$: this.toast$ }} />
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
            <stencil-route url="/" exact={true}>
              <stencil-router-redirect url="/themes" />
            </stencil-route>
          </stencil-route-switch>
        </stencil-router>
      </Host>
    )
  }
}
