/* eslint-disable react/jsx-no-bind */
import { Component, h, Host, State } from '@stencil/core'
import {
  ComponentItemBundle,
  ComponentListBundle,
  FormIntegrationActions,
  ThemeBundle,
} from '@typings'
import '@ui'
import '@ui/components/button'
import '@ui/components/toast'
import '@ui/pages/component-item'
import '@ui/pages/component-list'
import '@ui/pages/style-guide-details'
import '@ui/pages/style-guides'
import '@ui/pages/themes'
import { Observable } from 'rxjs'
import { createRouter, href, match, Route } from 'stencil-router-v2'
import { Components } from '../components'
import { APIService } from '../services'

const Router = createRouter()

@Component({
  tag: 'themeful-microfrontend',
  styleUrl: 'themeful.microfrontend.scss',
  shadow: true,
})
export class ThemefulMicrofrontend {
  private apiService: APIService
  private styleGuides$
  private themeBundle$: Observable<ThemeBundle>
  private componentListBundle$: Observable<ComponentListBundle>
  private componentBundle$: Observable<ComponentItemBundle>
  private toast$
  @State() mode?: string

  constructor() {
    this.apiService = APIService.Instance
    this.styleGuides$ = this.apiService.styleGuides$
    this.themeBundle$ = this.apiService.themeBundle$
    this.componentListBundle$ = this.apiService.componentListBundle$
    this.componentBundle$ = this.apiService.componentBundle$
    this.toast$ = this.apiService.toast$
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
          <Router.Switch>
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
                {...{
                  styleGuides$: this.styleGuides$,
                  onAction: this.onAction,
                }}
              ></tf-style-guides>
            </Route>
            <Route
              path={match('/styleguide/:slug')}
              render={({ slug }) => (
                <tf-style-guide-details
                  {...{
                    slug,
                    styleGuides$: this.styleGuides$,
                    onAction: this.onAction,
                  }}
                ></tf-style-guide-details>
              )}
            />
            <Route path="/components">
              <tf-component-list
                {...{
                  componentListBundle$: this.componentListBundle$,
                  onAction: this.onAction,
                }}
              ></tf-component-list>
            </Route>
            <Route
              path={match('/component/:uuid')}
              render={({ uuid }) => (
                <tf-component-item
                  {...{
                    uuid,
                    componentBundle$: this.componentBundle$,
                    onAction: this.onAction,
                  }}
                ></tf-component-item>
              )}
            />
            <Route path="/" to="/themes" />
          </Router.Switch>
        </main>
      </Host>
    )
  }
}
