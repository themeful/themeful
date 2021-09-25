import { Component, h } from '@stencil/core'
// import { APIService } from '../services/'

@Component({
  tag: 'themeful-microfrontend',
  styleUrl: 'themeful.microfrontend.scss',
  shadow: true,
})
export class ThemefulMicrofrontend {
  // private apiService: APIService

  constructor() {
    // this.apiService = APIService.Instance
  }

  private getText(): string {
    // this.apiService.getThemes().subscribe((data) => {
    //   console.log(data)
    // })
    return 'done'
  }

  public render(): HTMLThemefulMicrofrontendElement {
    return <div>Hello, World! {this.getText()}</div>
  }
}
