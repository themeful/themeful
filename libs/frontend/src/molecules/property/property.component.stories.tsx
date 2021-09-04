import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Molecules/Property Box',
}

export const propertyBox = ({properties}): HTMLElement => {
  return (
  <div>
    <div class='header'>
      <h1>Property Box</h1>
    </div>
    <div style={{display: 'flex', gap: '1rem' }}>
      {properties.map((args) => <tf-property {...args} onEdit={action('edit')}></tf-property>)}
    </div>
  </div>)
}

propertyBox.args = {
  properties: [
    {section: 'global', value: {name: 'Stuff', group: 'base', type: 'color', value: '#ff0000'}},
    {section: 'global', value: {name: 'Stuff', group: 'base', type: 'color', value: 'rgba(100,100,100,0.5)'}},
    {section: 'global', value: {name: 'Stuff', group: 'base', type: 'font', value: '1.25rem/1.5rem Arial, sans-serif;'}},
    {section: 'global', value: {name: 'Stuff', group: 'base', type: 'font-size', value: '1rem'}},
    {section: 'global', value: {name: 'Stuff', group: 'base', type: 'font-weight', value: '400'}},
    {section: 'global', value: {name: 'Stuff', group: 'base', type: 'font-family', value: 'Arial'}},
    {section: 'global', value: {name: 'Stuff', group: 'base', type: 'display', value: 'flex'}},
    {section: 'global', value: {name: 'Stuff', group: 'base', type: 'unknown', value: 'flex'}},
    {section: 'global', value: {name: 'Stuff', group: 'base', type: undefined, value: 'flex'}},
  ]
}