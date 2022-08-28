import { propertySelect } from '@properties'
import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core'
import { RouterHistory } from '@stencil/router'
import {
  ExtendedStyle,
  ExtendedStyleGuide,
  ExtendedStyleGuides,
  FormIntegrationActions,
  StyleGroup,
  StyleGuideBase,
  StyleGuideIntegrationAction,
  StyleTypeGroup,
} from '@typings'
import { Observable, Subject, Subscription } from 'rxjs'
import { Components } from '../../components'
import '../../components/button'
import '../../components/navigation'
import '../../components/property'
import '../../forms/form-integration'

@Component({
  tag: 'tf-style-guide-details',
  styleUrl: 'style-guide-details.component.scss',
  shadow: true,
})
export class StyleGuideDetailsComponent {
  /** History */
  @Prop() history!: RouterHistory

  /** Style Guides */
  @Prop() styleGuides$!: Observable<ExtendedStyleGuides>

  /** Style Guide Slug */
  @Prop() match!: { params: { slug: string } }

  @State() styleGuide!: ExtendedStyleGuide
  private formData$ = new Subject()

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<FormIntegrationActions>

  private onAction = ({ detail }: { detail: StyleGuideIntegrationAction }): void => {
    if (detail.action !== 'close') {
      this.action.emit(detail)
      if (['duplicate', 'delete'].includes(detail.action)) {
        this.history.push(`/styleguides`, {})
      }
    }
  }

  private sub = new Subscription()
  private styleGuideGroups!: { [styleguide: string]: string[] }

  private openStyleGuideForm = (styleGuide?: string, styleGuideBase?: StyleGuideBase): void => {
    this.formData$.next({
      form: 'styleguide',
      identifier: styleGuide,
      fields: styleGuideBase,
    })
  }

  private openStyleGuideDuplicateForm = (styleGuide: string, name: string): void => {
    this.formData$.next({
      form: 'styleguideDuplicate',
      identifier: styleGuide,
      fields: { name },
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
          if (styleguide.slug === this.match.params.slug) {
            this.styleGuide = styleguide
          }
        })
        this.styleGuideGroups = styleGuides.reduce(
          (result: { [key: string]: string[] }, styleguide) => {
            result[styleguide.slug] = []
            styleguide.types.forEach((type) => {
              type.groups.forEach((group) => {
                result[styleguide.slug].push(group.name)
              })
            })
            return result
          },
          {}
        )
      })
    )
  }

  public disconnectedCallback(): void {
    this.sub.unsubscribe()
  }

  public render(): HTMLTfStyleGuidesElement {
    return (
      this.styleGuide && (
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
              {
                label: 'Duplicate Style Guide',
                callback: () =>
                  this.openStyleGuideDuplicateForm(this.styleGuide.slug, this.styleGuide.name),
              },
            ]}
            size="small"
          />
          <div class="style-guide__wrapper">{this.renderStyleGuide(this.styleGuide)}</div>
          <tf-form-integration
            {...({
              formData$: this.formData$,
              onAction: this.onAction,
            } as Components.TfFormIntegration)}
          />
        </Host>
      )
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
