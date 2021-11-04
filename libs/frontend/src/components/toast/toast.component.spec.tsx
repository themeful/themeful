import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { mapTo, timer } from 'rxjs'
import { ToastComponent } from './toast.component'

describe('ToastComponent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ToastComponent],
      autoApplyChanges: true,
      template: () => <tf-toast />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const msg$ = timer(0, 5000).pipe(
      mapTo({
        text: 'Hello World',
        status: 'success',
      })
    )
    const page = await newSpecPage({
      components: [ToastComponent],
      autoApplyChanges: true,
      template: () => <tf-toast msg$={msg$} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
