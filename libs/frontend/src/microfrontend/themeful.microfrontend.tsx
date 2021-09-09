import { Component, h } from '@stencil/core'
import { APIService } from '../services/'

@Component({
  tag: 'themeful-component',
  styleUrl: 'themeful.microfrontend.scss',
  shadow: true,
})
export class ThemefulComponent {
  private apiService: APIService

  constructor() {
    this.apiService = APIService.Instance
  }

  private getText(): string {
    return this.apiService.getHello()
  }

  render() {
    return <div>Hello, World! {this.getText()}</div>
  }
}
