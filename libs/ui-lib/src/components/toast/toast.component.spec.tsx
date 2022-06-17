import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { Toast } from '@typings'
import { Subject } from 'rxjs'
import { ToastComponent } from './toast.component'

describe('ToastComponent', () => {
  it('renders with values', async (done) => {
    const subject = new Subject<Toast>()
    const page = await newSpecPage({
      components: [ToastComponent],
      template: () => <tf-toast msg$={subject} />,
    })
    page.root.addEventListener('state', async () => {
      await page.waitForChanges()
      expect(page.root).toMatchSnapshot()
      done()
    })
    subject.next({
      text: 'Hello World',
      status: 'success',
    })
    subject.complete()
  })
})
