import { h } from '@stencil/core'

export default {
  title: 'Atoms/Icon',
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
    ],
  },
}

export const icon = ({ icons }) => {
  return (
    <div>
      <h1>Icons</h1>
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
  )
}
