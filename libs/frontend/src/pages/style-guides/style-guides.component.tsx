import { Component, h, Host, Prop, State } from '@stencil/core'
import {
  ExtendedStyle,
  ExtendedStyleGuide,
  ExtendedStyleGuides,
  StyleGroup,
  StyleGuideBase,
  StyleTypeGroup,
} from '@typings'
import { Observable, Subscription } from 'rxjs'

@Component({
  tag: 'tf-style-guides',
  styleUrl: 'style-guides.component.scss',
  shadow: true,
})
export class StyleGuidesComponent {
  /** Style Guides */
  @Prop() styleGuides$: Observable<ExtendedStyleGuides>

  @State() styleGuides: ExtendedStyleGuides

  private sub?: Subscription

  private openStyleGuideForm = (styleGuide?: string, styleGuideBase?: StyleGuideBase): void => {
    console.log('openStyleGuideForm', styleGuideBase, styleGuide)
  }

  private openStyleForm = (styleGuide: string, extendedStyle?: ExtendedStyle): void => {
    console.log('openStyleForm', extendedStyle, styleGuide)
  }

  public componentWillLoad(): void {
    this.sub = this.styleGuides$?.subscribe((styleGuides) => {
      this.styleGuides = styleGuides
    })
  }

  public disconnectedCallback(): void {
    this.sub?.unsubscribe()
  }

  public render(): HTMLTfStyleGuidesElement {
    return (
      <Host>
        <nav>
          <tf-button {...{ onClick: () => this.openStyleGuideForm(), title: 'add style guide' }}>
            Add Style Guide
          </tf-button>
        </nav>
        <main class="style-guide__wrapper">
          {this.styleGuides &&
            this.styleGuides.map((styleGuide) => this.renderStyleGuide(styleGuide))}
        </main>
      </Host>
    )
  }

  private renderStyleGuide(styleGuide: ExtendedStyleGuide): HTMLElement {
    return (
      <div class="style-guide">
        <h3>
          {styleGuide.name}
          <tf-button
            {...{
              size: 'icon',
              onClick: () =>
                this.openStyleGuideForm(styleGuide.slug, {
                  name: styleGuide.name,
                  baseFontSize: styleGuide.baseFontSize,
                }),
              title: 'edit style guide',
            }}
          >
            <tf-icon icon="pen" />
          </tf-button>
          <tf-button
            {...{
              size: 'icon',
              onClick: () => this.openStyleForm(styleGuide.slug),
              title: 'add style',
            }}
          >
            <tf-icon icon="plus" />
          </tf-button>
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
          styleGuide,
          showGroup: false,
          onEdit: () => this.openStyleForm(styleGuide, extendedStyle),
        }}
      />
    )
  }
}
