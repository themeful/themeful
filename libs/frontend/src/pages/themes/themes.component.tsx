import { Component, h, Host, Prop, State } from '@stencil/core'
import {
  AliasTokens,
  APIBundle,
  DesignTokenRow,
  DesignTokens,
  Dt2At,
  ExtendedValueDetail,
  ExtendedValueDetails,
  StyleGuides,
  StyleMap,
  Theme,
  Themes,
} from '@typings'
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

  @State() rows: DesignTokenRow[]
  @State() themeNames: any
  private themes: Themes
  private designTokens: DesignTokens
  private aliasTokens: AliasTokens
  private styleGuides: StyleGuides
  private styleMap: StyleMap
  private sgBases: { name: string; key: string }[]
  private dt2at: Dt2At = {}
  private groups: string[]

  private sub?: Subscription

  public componentWillLoad(): void {
    this.sub = this.bundle$?.subscribe(([themes, designTokens, aliasTokens, styleGuides]) => {
      this.themes = themes
      this.aliasTokens = aliasTokens
      this.designTokens = designTokens
      this.styleGuides = styleGuides
      this.groups = []
      const { styleMap, sgNames } = this.transformStyleGuides(styleGuides)
      this.styleMap = styleMap
      this.sgBases = Object.keys(sgNames).map((key) => {
        return { name: sgNames[key], key }
      })
      const themeNames = Object.keys(themes).map((key) => ({
        displayName: `${sgNames[themes[key].styleGuide]} - ${themes[key].name}`,
        styleGuide: themes[key].styleGuide,
        name: themes[key].name,
        key,
      }))

      const rows: DesignTokenRow[] = []
      Object.keys(designTokens).forEach((designToken: string) => {
        this.dt2at[designToken] = designTokens[designToken].aliasTokens
        if (!this.groups.includes(designTokens[designToken].group)) {
          this.groups.push(designTokens[designToken].group)
        }
        const themeValues: ExtendedValueDetails[] = []
        Object.values(themes).forEach((theme: Theme) => {
          const themeValue: ExtendedValueDetails = []
          if (theme.styles[designToken]) {
            Object.entries(theme.styles[designToken]).forEach(([media, { style, direct }]) => {
              const themeMedia: ExtendedValueDetail = {
                media,
                name: styleMap[media] ? styleMap[media].name : 'Default',
                global: styleMap[media] ? styleMap[media].global : false,
                style: style ? { ...styleMap[style], key: style } : undefined,
                direct,
              }
              themeValue.push(themeMedia)
            })
          }
          themeValues.push(themeValue)
        })
        rows.push({ ...designTokens[designToken], token: designToken, themeValues })
      })
      this.rows = rows
      this.themeNames = themeNames
    })
  }

  private transformStyleGuides(styleGuides: StyleGuides) {
    const sgNames: { [styleguide: string]: string } = {}
    const styleMap: StyleMap = {}
    Object.keys(styleGuides).forEach((styleguide) => {
      sgNames[styleguide] = styleGuides[styleguide].name
      Object.keys(styleGuides[styleguide].styles).forEach((valueKey) => {
        styleMap[`${styleguide}_${valueKey}`] = {
          ...styleGuides[styleguide].styles[valueKey],
          global: styleguide === 'global',
        }
      })
    })
    return { styleMap, sgNames }
  }

  public disconnectedCallback(): void {
    this.sub?.unsubscribe()
  }

  public render(): HTMLTfThemesElement {
    return (
      <Host>
        <nav>
          <tf-button {...{ onClick: () => this.openThemeForm(), title: 'add theme' }}>
            Add Theme
          </tf-button>
        </nav>
        {/* <main class="style-guide__wrapper">
        {this.styleGuides &&
          this.styleGuides.map((styleGuide) => this.renderStyleGuide(styleGuide))}
      </main>
      <tf-form-integration {...{ formData$: this.formData$, onAction: this.onAction }} /> */}
      </Host>
    )
  }
}
