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
import { createRouter, href } from 'stencil-router-v2'
import '../../components/icon'
import '../../components/menu'
import '../../components/navigation'
import '../../components/property'
import '../../forms/form-integration'

const Router = createRouter()

@Component({
  tag: 'tf-style-guides',
  styleUrl: 'style-guides.component.scss',
  shadow: true,
})
export class StyleGuidesComponent {
  /** Style Guides */
  @Prop() styleGuides$!: Observable<ExtendedStyleGuides>

  @State() styleGuides!: ExtendedStyleGuides
  private formData$ = new Subject()

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action!: EventEmitter<FormIntegrationActions>

  private onAction = ({ detail }: { detail: FormIntegrationActions }): void => {
    if (detail.action !== 'close') {
      this.action.emit(detail)
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

  private openStyleForm = (styleGuide: string, extendedStyle?: ExtendedStyle): void => {
    this.formData$.next({
      form: 'style',
      identifier: { styleGuide, style: extendedStyle?.slug },
      groups: this.styleGuideGroups[styleGuide],
      propertyTypes: propertySelect,
      fields: extendedStyle,
    })
  }

  private openStyleGuideDuplicateForm = (styleGuide: string, name: string): void => {
    this.formData$.next({
      form: 'styleguideDuplicate',
      identifier: styleGuide,
      fields: { name },
    })
  }

  public componentWillLoad(): void {
    this.sub.add(
      this.styleGuides$?.subscribe((styleGuides) => {
        this.styleGuides = styleGuides
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
      <Host>
        <stencil-route-title pageTitle="Themeful - Style Guides" />
        <tf-navigation
          items={[
            {
              label: 'Add Style Guide',
              callback: this.openStyleGuideForm,
            },
          ]}
          size="small"
        />
        <div class="style-guide__wrapper">
          {this.styleGuides &&
            this.styleGuides.map((styleGuide) => this.renderStyleGuide(styleGuide))}
        </div>
        <tf-form-integration {...{ formData$: this.formData$, onAction: this.onAction }} />
      </Host>
    )
  }

  private renderStyleGuide(styleGuide: ExtendedStyleGuide): HTMLElement {
    return (
      <div class="style-guide">
        <h3>
          <a {...href(`/styleguide/${styleGuide.slug}`)}>{styleGuide.name}</a>
          <tf-menu
            items={[
              {
                label: 'Edit',
                icon: 'pen',
                callback: () =>
                  this.openStyleGuideForm(styleGuide.slug, {
                    name: styleGuide.name,
                    baseFontSize: styleGuide.baseFontSize,
                  }),
              },
              {
                label: 'Add Style',
                icon: 'plus',
                callback: () => this.openStyleForm(styleGuide.slug),
              },
              {
                label: 'Show',
                icon: 'search',
                callback: () => {
                  Router.push(`/styleguide/${styleGuide.slug}`)
                },
              },
              {
                label: 'Duplicate',
                icon: 'copy',
                callback: () => {
                  this.openStyleGuideDuplicateForm(styleGuide.slug, styleGuide.name)
                },
              },
            ]}
          />
        </h3>
        {styleGuide.types && styleGuide.types.map((type) => this.renderType(type, styleGuide.slug))}
      </div>
    )
  }

  private renderType(type: StyleTypeGroup, styleGuideSlug: string): HTMLElement {
    return (
      <div class="style-guide__type">
        <h4>{type.name}</h4>
        {type.groups &&
          type.groups.map((group) =>
            this.renderGroup(group, styleGuideSlug, type.groups.length > 1)
          )}
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
