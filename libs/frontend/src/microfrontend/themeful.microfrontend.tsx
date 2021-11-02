import { Component, h, State } from '@stencil/core'
// import { APIService } from '../services/'

@Component({
  tag: 'themeful-microfrontend',
  styleUrl: 'themeful.microfrontend.scss',
  shadow: true,
})
export class ThemefulMicrofrontend {
  // private apiService: APIService

  @State() active = 'stylequides'

  private nav = [
    { label: 'Style Guides', slug: 'stylequides', selectable: true },
    { label: 'Themes', slug: 'themes', selectable: true },
  ]

  constructor() {
    // this.apiService = APIService.Instance
  }

  // private getText(): string {
  //   // this.apiService.getThemes().subscribe((data) => {
  //   //   console.log(data)
  //   // })
  //   return 'done'
  // }

  private navChange = (item) => {
    this.active = item
  }

  private renderContent = (): HTMLElement => {
    console.log(this.active)
    if (this.active === 'stylequides') {
      return this.renderStyleGuides()
    }
    return this.renderThemes()
  }
  private renderStyleGuides = (): HTMLElement => <tf-style-guides />

  private renderThemes = (): HTMLElement => <tf-themes />

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
