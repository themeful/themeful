import { propertySelect } from '@properties'
import { Component, Event, EventEmitter, Fragment, h, Host, Prop, State } from '@stencil/core'
import {
  AliasTokens,
  ComponentItemBundle,
  Components,
  DesignTokenRow,
  DesignTokens,
  Dt2At,
  ExtendedStyleGuides,
  ExtendedValueDetail,
  ExtendedValueDetails,
  FormIntegrationActions,
  GlobalConfig,
  KeyValues,
  StyleMap,
  Theme,
  ThemeIntegrationAction,
  ThemeName,
  Themes,
} from '@typings'
import { Observable, Subject, Subscription } from 'rxjs'
import { href } from 'stencil-router-v2'
import { Components as ComponentTypes } from '../../components'
import '../../components/button'
import '../../components/icon'
import '../../components/menu'
import '../../components/navigation'
import '../../components/property'
import '../../forms/form-integration'

@Component({
  tag: 'tf-component-item',
  styleUrl: 'component-item.component.scss',
  shadow: true,
})
export class ComponentItemComponent {
  /** Component Item Bundle */
  @Prop() componentBundle$!: Observable<ComponentItemBundle>

  /** Style Guide Slug */
  @Prop() uuid!: string

  @State() rows: DesignTokenRow[] = []
  @State() componentID!: string
  private themeNames: ThemeName[] = []
  private themes: Themes = {}
  private components: Components = {}
  private designTokens: DesignTokens = {}
  private aliasTokens: AliasTokens = {}
  private styleMap?: StyleMap
  private dt2at: Dt2At = {}
  private groups: string[] = []
  private config?: GlobalConfig
  private formData$ = new Subject()
  private styleGuideHeaders: {
    [styleGuide: string]: { name: string; first: string; slug: string }
  } = {}
  private styleGuideCount: { [styleGuide: string]: number } = {}
  private nav = [
    { label: 'Add Theme', callback: () => this.openThemeForm() },
    {
      label: 'Add Design Token',
      callback: () => this.openDesignTokenForm(),
    },
    {
      label: 'Rescan Alias Tokens',
      callback: () => this.rescanAliasTokens(),
      position: 'right',
    },
  ]

  private sub = new Subscription()

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<FormIntegrationActions>

  private onAction = ({ detail }: { detail: ThemeIntegrationAction }): void => {
    if (detail.action !== 'close') {
      this.action.emit(detail)
    }
  }

  public componentWillLoad(): void {
    this.sub.add(
      this.componentBundle$?.subscribe(
        ([components, styleGuides, designTokens, aliasTokens, themes, config]) => {
          this.config = config
          this.themes = themes
          this.components = components
          console.log(this.uuid, this.components)
          this.aliasTokens = aliasTokens
          this.designTokens = designTokens
          this.groups = []
          const { styleMap, sgNames } = this.transformStyleGuides(styleGuides)
          this.styleMap = styleMap
          this.themeNames = []
          this.styleGuideHeaders = {}
          this.dt2at = {}
          this.styleGuideCount = {}
          Object.values(themes).forEach(({ styleGuide }) => {
            this.styleGuideCount[styleGuide] = (this.styleGuideCount[styleGuide] || 0) + 1
          })
          Object.keys(themes).forEach((key) => {
            this.themeNames.push({
              styleGuide: themes[key].styleGuide,
              name: themes[key].name,
              single: this.styleGuideCount[themes[key].styleGuide] === 1,
              key,
            })
            if (this.styleGuideHeaders[themes[key].styleGuide] === undefined) {
              this.styleGuideHeaders[themes[key].styleGuide] = {
                name: sgNames[themes[key].styleGuide],
                first: key,
                slug: themes[key].styleGuide,
              }
            }
          })
          const rows: DesignTokenRow[] = []
          Object.keys(designTokens).forEach((designToken) => {
            this.dt2at[designToken] = designTokens[designToken].aliasTokens as string[]
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
                    name: styleMap[media] ? (styleMap[media].name as string) : 'Default',
                    global: styleMap[media] ? (styleMap[media].global as boolean) : false,
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
        }
      )
    )
  }

  private transformStyleGuides(styleGuides: ExtendedStyleGuides) {
    const sgNames: { [styleguide: string]: string } = {}
    const styleMap: StyleMap = {}
    styleGuides.forEach((styleguide) => {
      sgNames[styleguide.slug] = styleguide.name
      styleguide.types.forEach((type) => {
        type.groups.forEach((group) => {
          group.styles.forEach((style) => {
            styleMap[`${styleguide.slug}_${style.slug}`] = {
              ...style,
              global: styleguide.slug === 'global',
            }
          })
        })
      })
    })
    return { styleMap, sgNames }
  }

  public disconnectedCallback(): void {
    this.sub.unsubscribe()
  }

  private openThemeForm = (theme?: string): void => {
    if (theme !== undefined) {
      this.formData$.next({
        form: 'theme',
        identifier: theme,
        styleGuides: Object.entries(this.styleGuideHeaders).map(([key, { name }]) => ({
          key,
          value: name,
        })),
        fields: {
          name: this.themes[theme]?.name,
          styleGuide: this.themes[theme]?.styleGuide,
        },
      })
    } else {
      this.formData$.next({
        form: 'theme',
        styleGuides: Object.entries(this.styleGuideHeaders).map(([key, { name }]) => ({
          key,
          value: name,
        })),
      })
    }
  }
  private openThemeDuplicateForm = (theme: string): void => {
    this.formData$.next({
      form: 'themeDuplicate',
      identifier: theme,
      fields: {
        name: this.themes[theme]?.name,
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
  private openDesignTokenSplitForm = (row: DesignTokenRow): void => {
    this.formData$.next({
      form: 'designTokenSplit',
      identifier: row.token,
      groups: this.groups,
      propertyTypes: propertySelect,
      aliasTokens: this.dt2at[row.token],
      fields: {
        name: row.name,
        description: row.description,
        selected: [],
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
          medias.push({ key, value: this.styleMap[key].name as string })
        }
      }
    }

    this.formData$.next({
      form: 'themeValue',
      identifier: { designToken, theme, media: themeMedia?.media },
      styles: styleMap,
      type: this.designTokens[designToken].type,
      medias,
      fields: {
        media: themeMedia?.media,
        style: themeMedia?.media
          ? this.themes[theme].styles[designToken][themeMedia?.media]?.style
          : '',
        direct: themeMedia?.media
          ? this.themes[theme].styles[designToken][themeMedia?.media]?.direct?.value
          : '',
      },
    })
  }

  private rescanAliasTokens = (): void => {
    this.action.emit({ action: 'rescan', controller: 'aliasToken' })
  }

  private renderHeader(): HTMLElement {
    return (
      <thead>
        <tr class="design-tokens__row design-tokens__header">
          <th colSpan={2}></th>
          {Object.values(this.styleGuideHeaders).map((styleGuide) => (
            <th colSpan={this.styleGuideCount[styleGuide.slug]}>
              <h2>
                <a {...href(`/styleguide/${styleGuide.slug}`)}>{styleGuide.name}</a>
                {this.styleGuideCount[styleGuide.slug] === 1 &&
                  this.renderThemeMenu(styleGuide.first)}
              </h2>
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
              {!theme.single && (
                <h2>
                  {theme.name}
                  {this.renderThemeMenu(theme.key)}
                </h2>
              )}
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  private renderThemeMenu(themeSlug: string): HTMLElement {
    return (
      <tf-menu
        items={[
          { label: 'Edit', icon: 'pen', callback: () => this.openThemeForm(themeSlug) },
          {
            label: 'Duplicate',
            icon: 'copy',
            callback: () => this.openThemeDuplicateForm(themeSlug),
          },
        ]}
      />
    )
  }

  private renderDesignTokenRow(row: DesignTokenRow): HTMLElement {
    return (
      <tr class="design-tokens__row" key={row.token}>
        <td>
          <h5 class="design-tokens__name">
            {row.name}
            <tf-menu
              items={[
                { label: 'Edit', icon: 'pen', callback: () => this.openDesignTokenForm(row) },
                {
                  label: 'Split/Copy',
                  icon: 'copy',
                  callback: () => this.openDesignTokenSplitForm(row),
                },
              ]}
            />
          </h5>
          <div class="design-tokens__desc">{row.description}</div>
          {this.config?.shortDesignTokens && (
            <div>
              <pre>({row.token})</pre>
              <pre>Using: --{row.short}</pre>
            </div>
          )}
          {!this.config?.shortDesignTokens && <pre>--{row.token}</pre>}
        </td>
        {row.aliasTokens && row.aliasTokens.length > 0 && (
          <td>
            <ul class="design-tokens__aliasTokens">
              {row.aliasTokens.slice(0, 4).map((aliasToken) => (
                <li>
                  <pre>${aliasToken}</pre>
                </li>
              ))}
              {row.aliasTokens.length > 4 && (
                <li>
                  <pre>...</pre>
                </li>
              )}
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

        {row.aliasTokens && row.aliasTokens.length === 0 && (
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
                  {...({
                    extendedStyle: themeMedia.style ?? themeMedia.direct,
                    onEdit: () =>
                      this.openThemeValueForm({
                        designToken: row.token,
                        themeMedia,
                        themeIndex,
                        themeValue,
                      }),
                  } as ComponentTypes.TfProperty)}
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
        <stencil-route-title pageTitle="Themeful - Themes" />
        <tf-navigation items={this.nav} size="small" />
        <div class="design-tokens__wrapper">
          <table class="design-tokens">
            {this.themeNames && this.renderHeader()}
            <tbody>{this.rows && this.rows.map((row) => this.renderDesignTokenRow(row))}</tbody>
          </table>
        </div>
        <tf-form-integration
          {...({
            formData$: this.formData$,
            onAction: this.onAction,
          } as ComponentTypes.TfFormIntegration)}
        />
      </Host>
    )
  }
}
