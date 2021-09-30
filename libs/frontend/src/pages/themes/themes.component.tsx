import { Component, Fragment, h, Host, Prop, State } from '@stencil/core'
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
  private styleMap: StyleMap
  private sgBases: { name: string; key: string }[]
  private dt2at: Dt2At = {}
  private groups: string[]

  private sub?: Subscription

  public componentWillLoad(): void {
    this.sub = this.bundle$?.subscribe(([styleGuides, designTokens, aliasTokens, themes]) => {
      this.themes = themes
      this.aliasTokens = aliasTokens
      this.designTokens = designTokens
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
      Object.keys(designTokens).forEach((designToken) => {
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

  private openThemeForm = (theme?: string): void => {
    console.log('openThemeForm', theme, this.themes, this.sgBases)
    // this.formData$.next({})
  }

  private openDesignTokenForm = (data?: any): void => {
    console.log('openDesignTokenForm', data)
    // this.formData$.next({})
  }

  private openAliasTokenSelect = (designToken: string): void => {
    console.log('openAliasTokenSelect', designToken, this.designTokens, this.aliasTokens)
    // this.formData$.next({})
  }
  private openThemeValueForm = (data: any): void => {
    console.log('openThemeValueForm', data, this.styleMap)
    // this.formData$.next({})
  }

  private rescanAliasTokens = (): void => {
    // this.formData$.next({})
  }

  private renderHeader(): HTMLElement {
    return (
      <div class="design-tokens__row design-tokens__header">
        <div>
          <h3>Design Token</h3>
        </div>
        <div>
          <h3>Alias Tokens</h3>
        </div>
        {this.themeNames.map((theme) => (
          <div>
            <h3>
              {theme.displayName}
              <tf-button
                {...{
                  onClick: () => this.openThemeForm(theme.key),
                  title: 'edit theme',
                  size: 'icon',
                }}
              >
                <tf-icon icon="pen" />
              </tf-button>
            </h3>
          </div>
        ))}
      </div>
    )
  }

  private renderDesignTokenRow(row): HTMLElement {
    return (
      <div class="design-tokens__row">
        <div>
          <h5 class="design-tokens__name">
            {row.name}
            <tf-button
              {...{
                onClick: () => this.openDesignTokenForm({ designToken: row }),
                title: 'edit design token',
                size: 'icon',
              }}
            >
              <tf-icon icon="pen" />
            </tf-button>
          </h5>
          <div class="design-tokens__desc">{row.description}</div>
          {row.short && (
            <div>
              <pre>({row.token})</pre>
              <pre>Using: --{row.short}</pre>
            </div>
          )}
          {!row.short && <pre>--{row.token}</pre>}
        </div>
        {row.aliasTokens.length > 0 && (
          <ul>
            {row.aliasTokens.map((aliasToken) => (
              <li>
                <pre>${aliasToken}</pre>
              </li>
            ))}
            <li class="design-tokens__select-aliasTokens">
              <tf-button
                {...{
                  onClick: () => this.openAliasTokenSelect(row.token),
                  title: 'select alias tokens',
                }}
              >
                Edit Alias Tokens
              </tf-button>
            </li>
          </ul>
        )}

        {row.aliasTokens.length === 0 && (
          <div>
            <tf-button
              {...{
                onClick: () => this.openAliasTokenSelect(row.token),
                title: 'select alias tokens',
              }}
            >
              Add Alias Tokens
            </tf-button>
          </div>
        )}
        {row.themeValues.map((themeValue) => (
          <div class="design-tokens__theme-value">
            {themeValue.map((themeMedia) => (
              <Fragment>
                {(themeValue.length > 1 || themeMedia.media !== 'default') && (
                  <span class="design-tokens__media-label icon-text-wrapper">
                    {themeMedia.global && <tf-icon size="small" icon="globe" />}
                    {themeMedia.name}
                  </span>
                )}

                <tf-property
                  {...{
                    extendedStyle: themeMedia.style ?? themeMedia.direct,
                    onEdit: () => this.openThemeValueForm({ designToken: row.token, themeMedia }), //{themeMedias, themeMedia, token: row.token, themeIndex: i}
                  }}
                  class="design-tokens__value"
                ></tf-property>
              </Fragment>
            ))}

            <tf-button
              {...{
                onClick: () => this.openThemeValueForm({ designToken: row.token }), //{themeMedias, token: row.token, themeIndex: i}
                title: 'add value',
                class: 'design-tokens__add-value',
              }}
            >
              Add Value
            </tf-button>
          </div>
        ))}
      </div>
    )
  }

  public render(): HTMLTfThemesElement {
    return (
      <Host>
        <nav>
          <tf-button {...{ onClick: () => this.openThemeForm(), title: 'add theme' }}>
            Add Theme
          </tf-button>
          <tf-button {...{ onClick: () => this.openDesignTokenForm(), title: 'add design token' }}>
            Add Design Token
          </tf-button>
          <tf-button {...{ onClick: () => this.rescanAliasTokens(), title: 'rescan alias tokens' }}>
            Rescan Alias Tokens
          </tf-button>
        </nav>
        <main class="design-tokens">
          {this.themeNames && this.renderHeader()}
          {this.rows && this.rows.map((row) => this.renderDesignTokenRow(row))}
        </main>
        {/* <tf-form-integration {...{ formData$: this.formData$, onAction: this.onAction }} /> */}
      </Host>
    )
  }
}
