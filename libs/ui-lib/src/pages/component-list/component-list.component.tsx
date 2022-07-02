import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core'
import {
  AliasTokens,
  ComponentListBundle,
  Components,
  FormIntegrationActions,
  Themes,
} from '@typings'
import { Observable, Subject, Subscription } from 'rxjs'
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
  @Prop() componentListBundle$: Observable<ComponentListBundle>

  private themes: Themes
  private components: Components
  private aliasTokens: AliasTokens
  private formData$ = new Subject()
  private nav = []

  private sub = new Subscription()

  /** Event emitted when an action is triggered */
  @Event({ composed: false }) action: EventEmitter<FormIntegrationActions>

  private onAction = ({ detail }): void => {
    if (detail.action !== 'close') {
      this.action.emit(detail)
    }
  }

  public componentWillLoad(): void {
    console.log('componentWillLoad', this.components)
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
      <table>
        {this.components &&
          Object.entries(this.components).map(([id, component]) => (
            <tr>
              <td>
                <stencil-route-link url={`/component/${id}`}>{component.name}</stencil-route-link>
              </td>
              <td> {id}</td>
            </tr>
          ))}
      </table>
    )
  }

  public render(): HTMLTfThemesElement {
    return (
      <Host>
        <stencil-route-title pageTitle="Themeful - Components" />
        <tf-navigation items={this.nav} size="small" />
        <div class="component-list__wrapper">{this.renderComponents()}</div>
        <tf-form-integration {...{ formData$: this.formData$, onAction: this.onAction }} />
      </Host>
    )
  }
}
