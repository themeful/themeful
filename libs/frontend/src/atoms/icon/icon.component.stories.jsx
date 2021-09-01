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
      'math-plus',
      'math-minus',
      'close',
      'globe',
    ],
  },
}

export const icon = ({ icons }) => {
  return (
    <div>
      <h1>Icons</h1>
      {icons.map((icon) => (
        <div>
          {icon}
          <tf-icon icon={icon} size="small" />
          <tf-icon icon={icon} />
          <tf-icon icon={icon} size="large" />
        </div>
      ))}
    </div>
  )
}
