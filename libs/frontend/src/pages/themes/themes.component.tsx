import { propertySelect } from '@properties'
import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core'
import {
  AliasTokens,
  APIBundle,
  DesignTokenRow,
  DesignTokens,
  Dt2At,
  ExtendedValueDetail,
  ExtendedValueDetails,
  FormIntegrationActions,
  KeyValues,
  StyleGuides,
  StyleMap,
  Theme,
  ThemeName,
  Themes,
} from '@typings'
import { Observable, Subject, Subscription } from 'rxjs'
import Fragment from 'stencil-fragment'
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
  private themeNames: ThemeName[]
  private themes: Themes
  private designTokens: DesignTokens
  private aliasTokens: AliasTokens
  private styleMap: StyleMap
  private dt2at: Dt2At = {}
  private groups: string[]
  private formData$ = new Subject()
  private styleGuideHeaders: { [styleGuide: string]: { name: string; count: number } }

  private sub?: Subscription

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<FormIntegrationActions>

  private onAction = ({ detail }): void => {
    if (detail.action !== 'close') {
      this.action.emit(detail)
    }
  }

  public componentWillLoad(): void {
    this.sub = this.bundle$?.subscribe(([styleGuides, designTokens, aliasTokens, themes]) => {
      this.themes = themes
      this.aliasTokens = aliasTokens
      this.designTokens = designTokens
      this.groups = []
      const { styleMap, sgNames } = this.transformStyleGuides(styleGuides)
      this.styleMap = styleMap
      this.themeNames = []
      this.styleGuideHeaders = {}
      Object.keys(themes).forEach((key) => {
        this.themeNames.push({
          styleGuide: themes[key].styleGuide,
          name: themes[key].name,
          key,
        })
        if (this.styleGuideHeaders[themes[key].styleGuide] === undefined) {
          this.styleGuideHeaders[themes[key].styleGuide] = {
            name: sgNames[themes[key].styleGuide],
            count: 1,
          }
        } else {
          this.styleGuideHeaders[themes[key].styleGuide].count++
        }
      })
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
    this.formData$.next({
      form: 'theme',
      identifier: theme,
      fields: {
        name: this.themes[theme]?.name,
        styleGuide: this.themes[theme]?.styleGuide,
      },
    })
  }

  private openDesignTokenForm = (row?: DesignTokenRow): void => {
    this.formData$.next({
      form: 'designToken',
      identifier: row?.token,
      groups: this.groups,
      propertyTypes: propertySelect,
      fields: {
        name: row?.name,
        group: row?.group,
        type: row?.type,
        description: row?.description,
      },
    })
  }

  private openAliasTokenSelect = (designToken: string): void => {
    if (this.aliasTokens) {
      const allUsed = Object.values(this.dt2at).reduce(
        (result, aliasTokens) => [...result, ...aliasTokens],
        []
      )
      const dtType = this.designTokens[designToken].type
      const freeAliasTokens = Object.keys(this.aliasTokens)
        .filter((key) => !allUsed.includes(key))
        .filter((key) => {
          if (dtType === 'size') {
            return this.aliasTokens[key].properties?.some((property) =>
              [
                'height',
                'width',
                'radius',
                'margin',
                'padding',
                'top',
                'bottom',
                'left',
                'right',
              ].some((word) => property.includes(word))
            )
          }
          if (dtType === 'color') {
            return this.aliasTokens[key].properties?.some(
              (property) => property.indexOf('color') !== -1
            )
          }
          if (dtType === 'font-size') {
            return this.aliasTokens[key].properties?.includes('font-size')
          }
          return true
        })

      this.formData$.next({
        form: 'aliasTokenSelect',
        identifier: designToken,
        aliasTokens: freeAliasTokens,
        fields: {
          selected: this.dt2at[designToken],
        },
      })
    }
  }
  private openThemeValueForm = ({
    designToken,
    themeMedia,
    themeIndex,
    themeValue,
  }: {
    designToken: string
    themeMedia?: ExtendedValueDetail
    themeIndex: number
    themeValue: ExtendedValueDetails
  }): void => {
    const [theme, themeData] = Object.entries(this.themes)[themeIndex]
    const styleGuide = themeData.styleGuide
    const styleMap: StyleMap = {}
    const usedMedias = themeValue.reduce(
      (result: string[], { media }: ExtendedValueDetail) => [...result, media],
      []
    ) as string[]

    const medias: KeyValues = []

    if (!usedMedias.includes('default') || themeMedia?.media === 'default') {
      medias.push({ key: 'default', value: 'Default' })
    }

    for (const key in this.styleMap) {
      if (key.startsWith('global_') || key.startsWith(`${styleGuide}_`)) {
        if (this.styleMap[key].type === this.designTokens[designToken].type) {
          styleMap[key] = this.styleMap[key]
        }
        if (
          this.styleMap[key].type === 'mediaquery' &&
          (!usedMedias.includes(key) || themeMedia?.media === key)
        ) {
          medias.push({ key, value: this.styleMap[key].name })
        }
      }
    }

    console.log({
      form: 'themeValue',
      identifier: { designToken, theme, media: themeMedia?.media },
      styles: styleMap,
      type: this.designTokens[designToken].type,
      medias,
      fields: {
        media: themeMedia?.media,
        style: this.themes[theme].styles[designToken][themeMedia?.media]?.style,
        direct: this.themes[theme].styles[designToken][themeMedia?.media]?.direct,
      },
    })

    // this.formData$.next({
    //   form: 'themeValue',
    //   identifier: { designToken, theme, media: themeMedia?.media },
    //   styles: styleMap,
    //   type: this.designTokens[designToken].type,
    //   medias,
    //   fields: {
    //     media: themeMedia?.media,
    //     style: this.themes[theme].styles[designToken][themeMedia?.media]?.style,
    //     direct: this.themes[theme].styles[designToken][themeMedia?.media]?.direct,
    //   },
    // })
  }

  private rescanAliasTokens = (): void => {
    this.action.emit({ action: 'rescan', controller: 'aliasToken' })
  }

  private renderHeader(): HTMLElement {
    return (
      <Fragment>
        <tr class="design-tokens__row design-tokens__header">
          <th colSpan={2}></th>
          {Object.values(this.styleGuideHeaders).map((styleGuide) => (
            <th colSpan={styleGuide.count}>
              <h2>{styleGuide.name}</h2>
            </th>
          ))}
        </tr>
        <tr class="design-tokens__row design-tokens__header">
          <th>
            <h2 class="left">Design Token</h2>
          </th>
          <th>
            <h2>Alias Tokens</h2>
          </th>
          {this.themeNames.map((theme) => (
            <th>
              <h2>
                {theme.name}
                <tf-button
                  {...{
                    onClick: () => this.openThemeForm(theme.key),
                    title: 'edit theme',
                    size: 'icon',
                  }}
                >
                  <tf-icon icon="pen" />
                </tf-button>
              </h2>
            </th>
          ))}
        </tr>
      </Fragment>
    )
  }

  private renderDesignTokenRow(row: DesignTokenRow): HTMLElement {
    return (
      <tr class="design-tokens__row">
        <td>
          <h5 class="design-tokens__name">
            {row.name}
            <tf-button
              {...{
                onClick: () => this.openDesignTokenForm(row),
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
        </td>
        {row.aliasTokens.length > 0 && (
          <td>
            <ul class="design-tokens__aliasTokens">
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
          </td>
        )}

        {row.aliasTokens.length === 0 && (
          <td class="design-tokens__add-aliasTokens">
            <tf-button
              {...{
                onClick: () => this.openAliasTokenSelect(row.token),
                title: 'select alias tokens',
              }}
            >
              Add Alias Tokens
            </tf-button>
          </td>
        )}
        {row.themeValues.map((themeValue, themeIndex) => (
          <td class="design-tokens__theme-value">
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
                    onEdit: () =>
                      this.openThemeValueForm({
                        designToken: row.token,
                        themeMedia,
                        themeIndex,
                        themeValue,
                      }),
                  }}
                  class="design-tokens__value"
                ></tf-property>
              </Fragment>
            ))}

            <tf-button
              {...{
                onClick: () =>
                  this.openThemeValueForm({ designToken: row.token, themeIndex, themeValue }),
                title: 'add value',
                class: 'design-tokens__add-value',
              }}
            >
              Add Value
            </tf-button>
          </td>
        ))}
      </tr>
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
        <table class="design-tokens">
          {this.themeNames && this.renderHeader()}
          {this.rows && this.rows.map((row) => this.renderDesignTokenRow(row))}
        </table>
        <tf-form-integration {...{ formData$: this.formData$, onAction: this.onAction }} />
      </Host>
    )
  }
}
