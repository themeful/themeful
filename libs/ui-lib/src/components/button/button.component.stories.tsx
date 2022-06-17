import { h } from '@stencil/core'
import Fragment from 'stencil-fragment'

export default {
  title: 'Components/Buttons',
  args: {
    buttons: [
      { label: 'Primary', args: { type: 'button', kind: 'primary' } },
      { label: 'Secondary', args: { type: 'submit', kind: 'secondary' } },
      { label: 'Danger', args: { type: 'button', kind: 'danger' } },
      { label: 'Selectable', args: { type: 'button', kind: 'selectable' } },
    ],
  },
}

const renderButtons = (buttons) => (
  <Fragment>
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
          <tf-button>
            <tf-icon icon="sync" />
            Some Text
          </tf-button>
        </td>
        <td>
          <tf-button>
            Some Text
            <tf-icon icon="sync" />
          </tf-button>
        </td>
        <td>
          <tf-button>
            <tf-icon icon="sync" />
          </tf-button>
        </td>
      </tr>
      <tr>
        <td>small</td>
        <td>
          <tf-button size="small">
            <tf-icon icon="sync" />
            Some Text
          </tf-button>
        </td>
        <td>
          <tf-button size="small">
            Some Text
            <tf-icon icon="sync" />
          </tf-button>
        </td>
        <td>
          <tf-button size="small">
            <tf-icon icon="sync" />
          </tf-button>
        </td>
      </tr>
      <tr>
        <td>icon</td>
        <td>
          <tf-button size="icon">
            <tf-icon icon="sync" />
            Some Text
          </tf-button>
        </td>
        <td>
          <tf-button size="icon">
            Some Text
            <tf-icon icon="sync" />
          </tf-button>
        </td>
        <td>
          <tf-button size="icon">
            <tf-icon icon="sync" />
          </tf-button>
        </td>
      </tr>
    </table>
  </Fragment>
)

export const buttons = ({ buttons }): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Buttons</h1>
      </div>
      <div class="content content--grid">
        <div class="tf-light">{renderButtons(buttons)}</div>
        <div>{renderButtons(buttons)}</div>
      </div>
    </div>
  )
}
