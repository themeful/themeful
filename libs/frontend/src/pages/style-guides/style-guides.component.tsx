import { Component, h, Prop, State } from '@stencil/core'
import {
  ExtendedStyle,
  ExtendedStyleGuide,
  ExtendedStyleGuides,
  StyleGroup,
  StyleTypeGroup,
} from '@typings'
import { Observable, Subscription } from 'rxjs'

@Component({
  tag: 'tf-style-guides',
  styleUrl: 'style-guides.component.scss',
  shadow: true,
})
export class StyleGuidesComponent {
  /** Style Guides*/
  @Prop() styleGuides$: Observable<ExtendedStyleGuides>

  @State() sub?: Subscription
  @State() styleGuides: ExtendedStyleGuides

  componentWillLoad() {
    this.sub = this.styleGuides$?.subscribe((styleGuides) => {
      this.styleGuides = styleGuides
    })
  }

  disconnectedCallback() {
    this.sub?.unsubscribe()
  }

  public render(): HTMLTfStyleGuidesElement {
    return (
      <main class="style-guide__wrapper">
        {this.styleGuides &&
          this.styleGuides.map((styleGuide) => this.renderStyleGuide(styleGuide))}
      </main>
    )
  }

  private renderStyleGuide(styleGuide: ExtendedStyleGuide): HTMLElement {
    return (
      <div class="style-guide">
        <h3>{styleGuide.name}</h3>
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

  private renderStyle(property: ExtendedStyle, styleGuide: string): HTMLTfPropertyElement {
    return <tf-property {...{ property, styleGuide, showGroup: false }} />
  }
}
