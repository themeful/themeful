import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Molecules/Property Box',
}

export const propertyBox = ({ properties }): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Property Box</h1>
      </div>
      <div class="content" style={{ display: 'flex', gap: '1rem' }}>
        {properties.map((args) => (
          <tf-property {...args} onEdit={action('edit')}></tf-property>
        ))}
      </div>
    </div>
  )
}

propertyBox.args = {
  properties: [
    {
      section: 'global',
      property: { name: 'Content', global: true, group: 'Color', type: 'color', value: '#ff0000' },
    },
    {
      section: 'global',
      property: {
        name: 'Background',
        group: 'Color',
        type: 'color',
        value: 'rgba(100,100,100,0.5)',
      },
    },
    {
      section: 'Client 1',
      property: {
        name: 'Default',
        group: 'Fonts',
        type: 'font',
        value: '1.25rem/1.5rem Arial, sans-serif;',
      },
    },
    {
      section: 'Client 2',
      property: { name: 'Stuff', group: 'base', type: 'font-size', value: '1rem' },
    },
    {
      section: 'global',
      property: { name: 'Stuff', group: 'base', type: 'font-weight', value: '400' },
    },
    {
      section: 'global',
      property: { name: 'Stuff', group: 'base', type: 'font-family', value: 'Arial' },
    },
    {
      section: 'global',
      property: { name: 'Stuff', group: 'base', type: 'display', value: 'flex' },
    },
    {
      section: 'fallback',
      property: {
        name: 'Unknown',
        group: 'base',
        type: 'mediaquery',
        value: 'screen and (min-width: 664px)',
      },
    },
    {
      section: 'fallback',
      property: { name: 'Unknown', group: 'base', type: 'unknown', value: 'flex' },
    },
    {
      section: 'global',
      property: {},
    },
  ],
}
