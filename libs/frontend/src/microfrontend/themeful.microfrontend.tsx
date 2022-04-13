import { Component, h, State } from '@stencil/core'
import { APIService } from '../services/'
// import { of } from 'rxjs'
// import styleGuidesSample from '../pages/style-guides/style-guides.sample.json'
// import themesSample from '../pages/themes/themes.sample.json'

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

  @State() active = 'stylequides'

  private nav = [
    { label: 'Style Guides', slug: 'stylequides', selectable: true },
    { label: 'Themes', slug: 'themes', selectable: true },
  ]

  constructor() {
    this.apiService = APIService.Instance
    this.styleGuides$ = this.apiService.styleGuides
    this.bundle$ = this.apiService.bundle
    this.toast$ = this.apiService.toast
  }

  private navChange = (item) => {
    this.active = item
  }

  private onAction = ({ detail }) => {
    console.log('onAction', detail)
    if (!['open', 'close'].includes(detail.action)) {
      this.apiService.action(detail).subscribe((result) => {
        this.toast$.next({
          text: result ? 'Updated' : 'Something went wrong',
          status: result ? 'success' : 'error',
        })
      })
    }
  }

  private renderContent = (): HTMLElement => {
    if (this.active === 'stylequides') {
      return this.renderStyleGuides()
    }
    return this.renderThemes()
  }

  private renderStyleGuides = (): HTMLElement => {
    const args = {
      styleGuides$: this.styleGuides$,
      onAction: this.onAction,
    }
    return <tf-style-guides {...args} />
  }

  private renderThemes = (): HTMLElement => {
    const args = {
      bundle$: this.bundle$,
      onAction: this.onAction,
    }
    return <tf-themes {...args} />
  }

  public render(): HTMLThemefulMicrofrontendElement {
    return (
      <div>
        <tf-navigation
          {...{
            items: this.nav,
            active: this.active,
            onItemClick: (event) => this.navChange(event.detail),
          }}
        />
        <tf-toast {...{ msg$: this.toast$ }} />
        {this.renderContent()}
      </div>
    )
  }
}
