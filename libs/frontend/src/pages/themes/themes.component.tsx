import { Component, h, Prop, State } from '@stencil/core'
import { AliasTokens, APIBundle, DesignTokens, StyleGuides, Themes } from '@typings'
import { Observable, Subscription } from 'rxjs'
// import { ThemeService } from '../..'

@Component({
  tag: 'tf-themes',
  styleUrl: 'themes.component.scss',
  shadow: true,
})
export class ThemesComponent {
  /** Style Guides */
  @Prop() bundle$: Observable<APIBundle>
  @State() themes: Themes
  @State() designTokens: DesignTokens
  @State() aliasTokens: AliasTokens
  @State() styleGuides: StyleGuides

  private sub?: Subscription

  public componentWillLoad(): void {
    this.sub = this.bundle$?.subscribe(([themes, designTokens, aliasTokens, styleGuides]) => {
      this.themes = themes
      this.aliasTokens = aliasTokens
      this.designTokens = designTokens
      this.styleGuides = styleGuides
    })
  }

  public disconnectedCallback(): void {
    this.sub?.unsubscribe()
  }

  public render(): HTMLTfThemesElement {
    return <div>Some Stuff</div>
  }
}
