import { Component, h, Host, Prop, State } from '@stencil/core'
import { Observable, Subject, Subscription, delay, filter, tap } from 'rxjs'

@Component({
  tag: 'tf-toast',
  styleUrl: 'toast.component.scss',
  shadow: true,
})
export class ToastComponent {
  /** Toast msg */
  @Prop() msg$: Observable<any>

  @State() sub?: Subscription

  @State() active$ = new Subject<boolean>()

  @State() open = false

  @State() text = ''

  @State() status = ''

  componentWillLoad() {
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

  disconnectedCallback() {
    this.sub?.unsubscribe()
  }

  render(): HTMLTfToastElement {
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
