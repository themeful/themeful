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

export const buttons = ({ buttons }): HTMLElement => {
  return (
    <div>
      <h1>Buttons</h1>
      <table style={{ borderSpacing: '1rem' }}>
        <tr>
          <td>
            <h3>default</h3>
          </td>
          <td>
            <h3>active</h3>
          </td>
          <td>
            <h3>disabled</h3>
          </td>
        </tr>
        {buttons.map((button) => {
          return (
            <tr>
              <td>
                <tf-button {...button.args}>{button.label}</tf-button>
              </td>
              <td>
                <tf-button {...button.args} active>
                  {button.label}
                </tf-button>
              </td>
              <td>
                <tf-button {...button.args} disabled>
                  {button.label}
                </tf-button>
              </td>
            </tr>
          )
        })}
      </table>
      <h1>With Icon</h1>
      <table>
        <tr>
          <td>default</td>
          <td>
            <tf-button kind="secondary">
              <tf-icon icon="sync"></tf-icon>Some Text
            </tf-button>
          </td>
          <td>
            <tf-button kind="secondary">
              Some Text<tf-icon icon="sync"></tf-icon>
            </tf-button>
          </td>
          <td>
            <tf-button kind="secondary">
              <tf-icon icon="sync"></tf-icon>
            </tf-button>
          </td>
        </tr>
        <tr>
          <td>small</td>
          <td>
            <tf-button kind="secondary" size="small">
              <tf-icon icon="sync"></tf-icon>Some Text
            </tf-button>
          </td>
          <td>
            <tf-button kind="secondary" size="small">
              Some Text<tf-icon icon="sync"></tf-icon>
            </tf-button>
          </td>
          <td>
            <tf-button kind="secondary" size="small">
              <tf-icon icon="sync"></tf-icon>
            </tf-button>
          </td>
        </tr>
        <tr>
          <td>icon</td>
          <td>
            <tf-button kind="secondary" size="icon">
              <tf-icon icon="sync"></tf-icon>Some Text
            </tf-button>
          </td>
          <td>
            <tf-button kind="secondary" size="icon">
              Some Text<tf-icon icon="sync"></tf-icon>
            </tf-button>
          </td>
          <td>
            <tf-button kind="secondary" size="icon">
              <tf-icon icon="sync"></tf-icon>
            </tf-button>
          </td>
        </tr>
      </table>
    </div>
  )
}
