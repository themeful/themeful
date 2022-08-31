import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core'
import {
  AliasTokens,
  ComponentListBundle,
  Components,
  FormIntegrationActions,
  ThemeIntegrationAction,
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
  tag: 'tf-component-list',
  styleUrl: 'component-list.component.scss',
  shadow: true,
})
export class ComponentListComponent {
  /** Component List Bundle */
  @Prop() componentListBundle$!: Observable<ComponentListBundle>

  @State() components!: Components
  private themes!: Themes
  private aliasTokens!: AliasTokens
  private formData$ = new Subject()
  private nav = []

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
      this.componentListBundle$?.subscribe(([components, aliasTokens, themes]) => {
        this.themes = themes
        this.components = components
        this.aliasTokens = aliasTokens
        console.log(this.components, this.themes, this.aliasTokens)
      })
    )
  }

  public disconnectedCallback(): void {
    this.sub.unsubscribe()
  }

  private renderComponents(): HTMLElement {
    return (
      <div class="component-list__wrapper">
        {Object.entries(this.components).map(([id, component]) => (
          <a {...href(`/component/${id}`)}>
            <div class="component-list__item">
              <span>{component.name}</span>
              <span>{id}</span>
            </div>
          </a>
        ))}
      </div>
    )
  }

  public render(): HTMLTfThemesElement {
    return (
      <Host>
        <stencil-route-title pageTitle="Themeful - Components" />
        <tf-navigation items={this.nav} size="small" />
        {this.components && this.renderComponents()}
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
