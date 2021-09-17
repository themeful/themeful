import { Component, h, Prop, State } from '@stencil/core'
import { Observable, Subscription } from 'rxjs'
import { StyleGuideService } from '../..'

@Component({
  tag: 'tf-style-guides',
  styleUrl: 'style-guides.component.scss',
  shadow: true,
})
export class StyleGuidesComponent {
  /** Style Guides*/
  @Prop() styleGuides$: Observable<any>

  @State() sub?: Subscription
  @State() styleGuides: any

  componentWillLoad() {
    const xx = StyleGuideService.Instance
    console.log(xx)
    this.sub = this.styleGuides$?.subscribe((styleGuides) => {
      console.log(styleGuides)
      this.styleGuides = styleGuides
    })
  }

  disconnectedCallback() {
    this.sub?.unsubscribe()
  }

  render() {
    return (
      <div>
        {this.styleGuides &&
          this.styleGuides.map((styleGuide) => {
            return <span>{styleGuide.name}</span>
          })}
      </div>
    )
  }
}
