import { h } from '@stencil/core'
import { interval, mapTo } from 'rxjs'

export default {
  title: 'Molecules/Toast',
}

export const toast = ({ first, second }): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Toast</h1>
      </div>
      <div class="content">
        <div style={{ position: 'relative', width: '400px', height: '200px' }}>
          <tf-toast {...first}></tf-toast>
        </div>
        <div style={{ position: 'relative', width: '400px', height: '200px' }}>
          <tf-toast {...second}></tf-toast>
        </div>
      </div>
    </div>
  )
}

toast.args = {
  first: {
    msg$: interval(5000).pipe(
      mapTo({
        text: 'Hello World',
        status: 'success',
      })
    ),
  },
  second: {
    msg$: interval(5000).pipe(
      mapTo({
        text: 'Hello World',
        status: 'error',
      })
    ),
  },
}
