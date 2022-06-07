import { h } from '@stencil/core'

export default {
  title: 'Components/Icon',
  args: {
    icons: [
      'chevron-right',
      'chevron-left',
      'pen',
      'sync',
      'trash',
      'plus',
      'minus',
      'close',
      'globe',
      'copy',
      'menu',
      'search',
    ],
  },
}

export const icon = ({ icons }): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Icons</h1>
      </div>
      <div class="content content--grid">
        <div class="tf-light">
          <table style={{ borderSpacing: '1rem' }}>
            <tr>
              <th></th>
              <th>small</th>
              <th>default</th>
              <th>large</th>
            </tr>
            {icons.map((icon) => (
              <tr>
                <td>{icon}</td>
                <td>
                  <tf-icon icon={icon} size="small" />
                </td>
                <td>
                  <tf-icon icon={icon} />
                </td>
                <td>
                  <tf-icon icon={icon} size="large" />
                </td>
              </tr>
            ))}
          </table>
        </div>
        <div>
          <table style={{ borderSpacing: '1rem' }}>
            <tr>
              <th></th>
              <th>small</th>
              <th>default</th>
              <th>large</th>
            </tr>
            {icons.map((icon) => (
              <tr>
                <td>{icon}</td>
                <td>
                  <tf-icon icon={icon} size="small" />
                </td>
                <td>
                  <tf-icon icon={icon} />
                </td>
                <td>
                  <tf-icon icon={icon} size="large" />
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  )
}
