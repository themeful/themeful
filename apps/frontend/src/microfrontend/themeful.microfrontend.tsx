import { Component, h, Host } from '@stencil/core'
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

  public componentWillLoad(): void {
    if (window.location.pathname === '/') {
      window.location.href = '/themes'
    }
  }

  public render(): HTMLThemefulMicrofrontendElement {
    return (
      <Host>
        <header>
          <div>
            <img class="logo" src="/assets/themeful.svg" />
            <h1>Themefulx</h1>
          </div>
          <nav class="button-group">
            <stencil-route-link url="/themes">
              <tf-button kind="selectable">Themes</tf-button>
            </stencil-route-link>
            <stencil-route-link url="/styleguides">
              <tf-button kind="selectable">Style Guides</tf-button>
            </stencil-route-link>
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
          </stencil-route-switch>
        </stencil-router>
      </Host>
    )
  }
}
