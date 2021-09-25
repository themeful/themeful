import { Component, h, Host, Prop, State } from '@stencil/core'
import { Toast } from '@typings'
import { Observable, Subject, Subscription } from 'rxjs'
import { delay, filter, tap } from 'rxjs/operators'

@Component({
  tag: 'tf-toast',
  styleUrl: 'toast.component.scss',
  shadow: true,
})
export class ToastComponent {
  /** Toast msg */
  @Prop() msg$: Observable<Toast>

  @State() open = false
  @State() text = ''
  @State() status = ''

  private sub?: Subscription
  private active$ = new Subject<boolean>()

  public componentWillLoad(): void {
    this.sub = this.msg$?.subscribe(({ text, status }) => {
      this.status = status
      this.text = text
      this.active$.next(true)
    })
    this.sub?.add(
      this.active$
        .pipe(
          filter((state: boolean) => state),
          delay(10),
          tap(() => {
            this.open = true
          }),
          delay(4000),
          tap(() => {
            this.open = false
          }),
          delay(500)
        )
        .subscribe(() => {
          this.status = ''
          this.text = ''
          this.active$.next(false)
        })
    )
  }

  public disconnectedCallback(): void {
    this.sub?.unsubscribe()
  }

  public render(): HTMLTfToastElement {
    return (
      <Host>
        {this.text !== '' && (
          <div class="toast__wrapper">
            <div
              class={`toast__msg toast__msg--${this.status}${this.open ? ' toast__msg--open' : ''}`}
            >
              {this.text}
            </div>
          </div>
        )}
      </Host>
    )
  }
}
