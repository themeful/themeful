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

  @State() active = 'stylequides'

  private nav = [
    { label: 'Style Guides', slug: 'stylequides', selectable: true },
    { label: 'Themes', slug: 'themes', selectable: true },
  ]

  constructor() {
    this.apiService = APIService.Instance
    this.styleGuides$ = this.apiService.styleGuides
    this.bundle$ = this.apiService.bundle
  }

  private navChange = (item) => {
    this.active = item
  }

  private onAction = ({ detail }) => {
    console.log('onAction', detail)
    if (!['open', 'close'].includes(detail.action)) {
      this.apiService.action(detail).subscribe((result) => {
        console.log(result)
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
    this.apiService.getFormattedStyleGuides()
    return <tf-style-guides {...args} />
  }

  private renderThemes = (): HTMLElement => {
    const args = {
      bundle$: this.bundle$,
      onAction: this.onAction,
    }
    this.apiService.getStyleGuides()
    this.apiService.getThemes()
    this.apiService.getDesignTokens()
    this.apiService.getAliasTokens()
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
        {this.renderContent()}
      </div>
    )
  }
}
