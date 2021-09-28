import { h } from '@stencil/core'
import { timer } from 'rxjs'
import { mapTo } from 'rxjs/operators'

export default {
  title: 'Components/Toast',
}

export const toast = ({ first, second }): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Toast</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '400px', height: '100px' }}>
          <tf-toast {...first} />
        </div>
        <div style={{ position: 'relative', width: '400px', height: '100px' }}>
          <tf-toast {...second} />
        </div>
      </div>
    </div>
  )
}

toast.args = {
  first: {
    msg$: timer(0, 5000).pipe(
      mapTo({
        text: 'Hello World',
        status: 'success',
      })
    ),
  },
  second: {
    msg$: timer(0, 5000).pipe(
      mapTo({
        text: 'Hello World',
        status: 'error',
      })
    ),
  },
}
