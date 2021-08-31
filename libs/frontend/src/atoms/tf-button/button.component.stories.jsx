import { h } from '@stencil/core'

export default {
  title: 'Atoms/Buttons',
  args: {
    buttons: [
      { label: 'Primary', args: { type: 'button', kind: 'primary' } },
      { label: 'Secondary', args: { type: 'submit', kind: 'secondary' } },
      { label: 'Danger', args: { type: 'button', kind: 'danger' } },
    ],
  },
}

export const buttons = ({ buttons }) => {
  return (
    <div style={{ display: 'table', borderSpacing: '0.5rem' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', textAlign: 'center' }}>
          <h3>default</h3>
        </div>
        <div style={{ display: 'table-cell', textAlign: 'center' }}>
          <h3>active</h3>
        </div>
        <div style={{ display: 'table-cell', textAlign: 'center' }}>
          <h3>disabled</h3>
        </div>
      </div>
      {buttons.map((button) => {
        return (
          <div style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', textAlign: 'center' }}>
              <tf-button {...button.args}>{button.label}</tf-button>
            </div>
            <div style={{ display: 'table-cell', textAlign: 'center' }}>
              <tf-button {...button.args} active>
                {button.label}
              </tf-button>
            </div>
            <div style={{ display: 'table-cell', textAlign: 'center' }}>
              <tf-button {...button.args} disabled>
                {button.label}
              </tf-button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
