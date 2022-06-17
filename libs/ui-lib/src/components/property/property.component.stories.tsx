import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Components/Property Box',
}

export const propertyBox = ({ properties, wrappers, grouped }): HTMLElement => {
  return (
    <div>
      <div class="header">
        <h1>Property Box</h1>
      </div>
      <div class="content content--grid">
        <div class="tf-light">
          <h2>Types</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '100%' }}>
            {properties.map((args) => (
              <tf-property {...args} onEdit={action('edit')} />
            ))}
          </div>
          <h2>Context</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '100%' }}>
            {wrappers.map(({ item, wrapperClass }) => (
              <div class={wrapperClass}>
                <tf-property {...item} onEdit={action('edit')} />
              </div>
            ))}
            <div class="property--grouped">
              <tf-property {...grouped} onEdit={action('edit')} />
              <tf-property {...grouped} onEdit={action('edit')} />
              <tf-property {...grouped} onEdit={action('edit')} />
            </div>
          </div>
        </div>
        <div>
          <h2>Types</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '100%' }}>
            {properties.map((args) => (
              <tf-property {...args} onEdit={action('edit')} />
            ))}
          </div>
          <h2>Context</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '100%' }}>
            {wrappers.map(({ item, wrapperClass }) => (
              <div class={wrapperClass}>
                <tf-property {...item} onEdit={action('edit')} />
              </div>
            ))}
            <div class="property--grouped">
              <tf-property {...grouped} onEdit={action('edit')} />
              <tf-property {...grouped} onEdit={action('edit')} />
              <tf-property {...grouped} onEdit={action('edit')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

propertyBox.args = {
  properties: [
    {
      section: 'global',
      extendedStyle: {
        name: 'Background color',
        global: true,
        group: 'Very long named nice',
        type: 'color',
        value: '#ff0000',
      },
    },
    {
      section: 'global',
      extendedStyle: {
        name: 'Content',
        group: 'Color',
        type: 'color',
        value: 'rgba(23, 124, 124, 0.5)',
      },
    },
    {
      section: 'StyleGuide 1',
      extendedStyle: {
        name: 'Default',
        group: 'Fonts',
        type: 'font',
        value: '1.25rem/1.5rem monospace',
      },
    },
    {
      section: 'StyleGuide 2',
      extendedStyle: { name: 'Stuff', group: 'base', type: 'font-size', value: '1rem' },
    },
    {
      section: 'global',
      extendedStyle: { name: 'Stuff', group: 'base', type: 'font-weight', value: '600' },
    },
    {
      section: 'global',
      extendedStyle: { name: 'Stuff', group: 'base', type: 'font-family', value: 'monospace' },
    },
    {
      section: 'global',
      extendedStyle: { name: 'Stuff', group: 'base', type: 'display', value: 'flex' },
    },
    {
      section: 'global',
      extendedStyle: { name: 'Normal', group: 'Size', type: 'size', value: '1rem' },
    },
    {
      section: 'global',
      extendedStyle: { name: 'Small', group: 'Size', type: 'size', value: '4px' },
    },
    {
      section: 'global',
      extendedStyle: { name: 'Large', group: 'Size', type: 'size', value: '20px' },
    },
    {
      section: 'fallback',
      extendedStyle: {
        name: 'Unknown',
        group: 'base',
        type: 'mediaquery',
        value: 'screen and (min-width: 664px)',
      },
    },
    {
      section: 'fallback',
      extendedStyle: { name: 'Unknown', group: 'base', type: 'unknown', value: 'flex' },
    },
    {
      section: 'global',
      extendedStyle: {},
    },
  ],
  wrappers: [
    {
      item: {
        section: 'global',
        extendedStyle: { value: '.property--selectable', type: 'unknown' },
      },
      wrapperClass: 'property--selectable',
    },
    {
      item: {
        section: 'global',
        extendedStyle: { value: '.property--selected', type: 'unknown' },
        class: 'property--selected',
      },
      wrapperClass: 'property--selectable',
    },
  ],
  grouped: {
    section: 'global',
    extendedStyle: { value: '.property--grouped', type: 'unknown' },
  },
}
