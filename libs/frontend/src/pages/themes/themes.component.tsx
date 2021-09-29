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
  private styleMap: any
  private sgBases: any
  private dt2at: any = {}
  private groups = []

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

      const rows: any[] = []
      Object.keys(designTokens).forEach((designToken: string) => {
        this.dt2at[designToken] = designTokens[designToken].aliasTokens
        if (!this.groups.includes(designTokens[designToken].group)) {
          this.groups.push(designTokens[designToken].group)
        }
        const themeValues: ThemeMedias[] = []
        Object.values(themes).forEach((theme: Theme) => {
          const themeValue: ThemeMedias = []
          if (theme.styles[designToken]) {
            Object.entries(theme.styles[designToken]).forEach(([media, { style, direct }]) => {
              const themeMedia: ThemeMedia = {
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

      return { rows, themeNames }
    })
  }

  private transformStyleGuides(styleGuides: StyleGuides) {
    const sgNames: any = {}
    const styleMap = {}
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
    return <div>Some Stuff</div>
  }
}
