import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { Toast } from '@typings'
import { Subject } from 'rxjs'
import { ToastComponent } from './toast.component'

describe('ToastComponent', () => {
  it('renders with values', async () => {
    const subject = new Subject<Toast>()
    const page = await newSpecPage({
      components: [ToastComponent],
      autoApplyChanges: true,
      template: () => <tf-toast msg$={subject} />,
    })
    subject.next({
      text: 'Hello World',
      status: 'success',
    })
    subject.complete()
    expect(page.root).toMatchSnapshot()
  })
})
