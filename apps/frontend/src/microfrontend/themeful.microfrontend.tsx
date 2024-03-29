/* eslint-disable react/jsx-no-bind */
import { Component, h, Host, State } from '@stencil/core'
import {
  ComponentItemBundle,
  ComponentListBundle,
  FormIntegrationActions,
  ThemeBundle,
} from '@typings'
import '@ui'
import { RouterService } from '@ui'
import '@ui/components/button'
import '@ui/components/toast'
import '@ui/pages/component-item'
import '@ui/pages/component-list'
import '@ui/pages/style-guide-details'
import '@ui/pages/style-guides'
import '@ui/pages/themes'
import { Observable } from 'rxjs'
import { href, match, Route, Router } from 'stencil-router-v2'
import { Components } from '../components'
import { APIService } from '../services'

@Component({
  tag: 'themeful-microfrontend',
  styleUrl: 'themeful.microfrontend.scss',
  shadow: true,
})
export class ThemefulMicrofrontend {
  private apiService: APIService
  private routerService: RouterService
  private styleGuides$
  private themeBundle$: Observable<ThemeBundle>
  private componentListBundle$: Observable<ComponentListBundle>
  private componentBundle$: Observable<ComponentItemBundle>
  private toast$
  @State() public mode?: string

  private Router: Router

  constructor() {
    this.apiService = APIService.Instance
    this.styleGuides$ = this.apiService.styleGuides$
    this.themeBundle$ = this.apiService.themeBundle$
    this.componentListBundle$ = this.apiService.componentListBundle$
    this.componentBundle$ = this.apiService.componentBundle$
    this.toast$ = this.apiService.toast$
    this.routerService = RouterService.Instance
    this.Router = this.routerService.getRouter()
  }

  private onAction = ({ detail }: { detail: FormIntegrationActions }) => {
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

  private renderStyleGuideDetails = (params: {
    [param: string]: string
  }): Components.TfStyleGuideDetails => (
    <tf-style-guide-details
      {...({
        slug: params['slug'],
        styleGuides$: this.styleGuides$,
        onAction: this.onAction,
      } as Components.TfStyleGuideDetails)}
    ></tf-style-guide-details>
  )

  private renderComponentDetails = (params: { [param: string]: string }) => (
    <tf-component-item
      {...({
        uuid: params['uuid'],
        componentBundle$: this.componentBundle$,
        onAction: this.onAction,
      } as Components.TfComponentItem)}
    ></tf-component-item>
  )

  public render(): HTMLThemefulMicrofrontendElement {
    return (
      <Host>
        <header>
          <a {...href('/themes')}>
            <img class="logo" src="/assets/themeful.svg" />
          </a>
          <div class="navigation">
            <h1>Themeful</h1>
            <nav class="button-group nav-row">
              <a {...href('/themes')}>
                <tf-button kind="selectable">Themes</tf-button>
              </a>
              <a {...href('/styleguides')}>
                <tf-button kind="selectable">Style Guides</tf-button>
              </a>
              <a {...href('/components')}>
                <tf-button kind="selectable">Components</tf-button>
              </a>
              <tf-button class="mode-toggle" onClick={this.toogleMode} kind="selectable">
                {this.mode === 'light' ? 'Dark' : 'Light'} Mode
              </tf-button>
            </nav>
          </div>

          <tf-toast {...({ msg$: this.toast$ } as Components.TfToast)} />
        </header>
        <main>
          <this.Router.Switch>
            <Route path="/themes">
              <tf-themes
                {...{
                  themeBundle$: this.themeBundle$,
                  onAction: this.onAction,
                }}
              ></tf-themes>
            </Route>
            <Route path="/styleguides">
              <tf-style-guides
                {...({
                  styleGuides$: this.styleGuides$,
                  onAction: this.onAction,
                } as Components.TfStyleGuides)}
              ></tf-style-guides>
            </Route>
            <Route path={match('/styleguide/:slug')} render={this.renderStyleGuideDetails} />
            <Route path="/components">
              <tf-component-list
                {...({
                  componentListBundle$: this.componentListBundle$,
                  onAction: this.onAction,
                } as Components.TfComponentList)}
              ></tf-component-list>
            </Route>
            <Route path={match('/component/:uuid')} render={this.renderComponentDetails} />
            <Route path="/" to="/themes" />
          </this.Router.Switch>
        </main>
      </Host>
    )
  }
}
