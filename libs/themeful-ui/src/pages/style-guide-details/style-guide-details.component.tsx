import { propertySelect } from '@properties'
import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core'
import {
  ExtendedStyle,
  ExtendedStyleGuide,
  ExtendedStyleGuides,
  FormIntegrationActions,
  StyleGroup,
  StyleGuideBase,
  StyleTypeGroup,
} from '@typings'
import { Observable, Subject, Subscription } from 'rxjs'

@Component({
  tag: 'tf-style-guide-details',
  styleUrl: 'style-guide-details.component.scss',
  shadow: true,
})
export class StyleGuideDetailsComponent {
  /** Style Guides */
  @Prop() styleGuides$: Observable<ExtendedStyleGuides>

  /** Style Guide Slug */
  @Prop() match: { params: { slug: string } }

  @State() styleGuide: ExtendedStyleGuide
  private formData$ = new Subject()

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<FormIntegrationActions>

  private onAction = ({ detail }): void => {
    if (detail.action !== 'close') {
      this.action.emit(detail)
    }
  }

  private sub = new Subscription()
  private styleGuideGroups: { [styleguide: string]: string[] }

  private openStyleGuideForm = (styleGuide?: string, styleGuideBase?: StyleGuideBase): void => {
    this.formData$.next({
      form: 'styleguide',
      identifier: styleGuide,
      fields: styleGuideBase,
    })
  }

  private openStyleForm = (styleGuide: string, extendedStyle?: ExtendedStyle): void => {
    this.formData$.next({
      form: 'style',
      identifier: { styleGuide, style: extendedStyle?.slug },
      groups: this.styleGuideGroups[styleGuide],
      propertyTypes: propertySelect,
      fields: extendedStyle,
    })
  }

  public componentWillLoad(): void {
    this.sub.add(
      this.styleGuides$?.subscribe((styleGuides) => {
        styleGuides.forEach((styleguide) => {
          console.log('3', styleguide, this.match.params.slug)
          if (styleguide.slug === this.match.params.slug) {
            this.styleGuide = styleguide
            console.log('2', this.styleGuide)
          }
        })
        console.log('1', this.styleGuide)
        this.styleGuideGroups = styleGuides.reduce((result, styleguide) => {
          result[styleguide.slug] = []
          styleguide.types.forEach((type) => {
            type.groups.forEach((group) => {
              result[styleguide.slug].push(group.name)
            })
          })
          return result
        }, {})
      })
    )
  }

  public disconnectedCallback(): void {
    this.sub.unsubscribe()
  }

  public render(): HTMLTfStyleGuidesElement {
    if (!this.styleGuide) {
      return
    }
    return (
      <Host>
        <stencil-route-title pageTitle={`Themeful - ${this.styleGuide.name}`} />
        <tf-navigation
          items={[
            {
              label: 'Edit Style Guide',
              callback: () =>
                this.openStyleGuideForm(this.styleGuide.slug, {
                  name: this.styleGuide.name,
                  baseFontSize: this.styleGuide.baseFontSize,
                }),
            },
            {
              label: 'Add Style',
              callback: () => this.openStyleForm(this.styleGuide.slug),
            },
          ]}
          size="small"
        />
        <main class="style-guide__wrapper">{this.renderStyleGuide(this.styleGuide)}</main>
        <tf-form-integration {...{ formData$: this.formData$, onAction: this.onAction }} />
      </Host>
    )
  }

  private renderStyleGuide(styleGuide: ExtendedStyleGuide): HTMLElement {
    return (
      <div class="style-guide">
        <h2>{styleGuide.name}</h2>
        {styleGuide.types && styleGuide.types.map((type) => this.renderType(type, styleGuide.slug))}
      </div>
    )
  }

  private renderType(type: StyleTypeGroup, styleGuideSlug: string): HTMLElement {
    return (
      <div class="style-guide__type">
        <h3>{type.name}</h3>
        <div class="style-guide__groups">
          {type.groups &&
            type.groups.map((group) =>
              this.renderGroup(group, styleGuideSlug, type.groups.length > 1)
            )}
        </div>
      </div>
    )
  }

  private renderGroup(group: StyleGroup, styleGuideSlug: string, showGroup: boolean): HTMLElement {
    return (
      <div class="style-guide__group property--grouped">
        {showGroup && <h5>{group.name}</h5>}
        {group.styles && group.styles.map((style) => this.renderStyle(style, styleGuideSlug))}
      </div>
    )
  }

  private renderStyle(extendedStyle: ExtendedStyle, styleGuide: string): HTMLTfPropertyElement {
    return (
      <tf-property
        {...{
          extendedStyle,
          showGroup: false,
          onEdit: () => this.openStyleForm(styleGuide, extendedStyle),
        }}
      />
    )
  }
}
