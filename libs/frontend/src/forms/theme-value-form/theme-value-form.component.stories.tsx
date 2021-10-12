import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import Fragment from 'stencil-fragment'

const styles = {
  global_base_black: {
    name: 'Black',
    type: 'color',
    group: 'base',
    value: '#333333',
    global: true,
  },
  global_base_light: {
    name: 'Light',
    type: 'color',
    group: 'base',
    value: '#ffffff',
    global: true,
  },
  global_gray_100: {
    name: '100',
    type: 'color',
    group: 'gray',
    value: 'rgba(0, 0, 0, 0.75)',
    global: true,
  },
  global_gray_200: {
    name: '200',
    type: 'color',
    group: 'gray',
    value: 'rgba(0, 0, 0, 0.60)',
    global: true,
  },
  global_gray_300: {
    name: '300',
    type: 'color',
    group: 'gray',
    value: 'rgba(0, 0, 0, 0.45)',
    global: true,
  },
  global_gray_400: {
    name: '400',
    type: 'color',
    group: 'gray',
    value: 'rgba(0, 0, 0, 0.30)',
    global: true,
  },
  global_gray_500: {
    name: '500',
    type: 'color',
    group: 'gray',
    value: 'rgba(0, 0, 0, 0.15)',
    global: true,
  },
  styleGuide1_action_primary: {
    name: 'Primary',
    type: 'color',
    group: 'action',
    value: '#31ed31',
    global: false,
  },
  styleGuide1_action_secondary: {
    name: 'Secondary',
    type: 'color',
    group: 'action',
    value: '#2ec22e',
    global: false,
  },
  styleGuide1_action_tertiary: {
    name: 'Tertiary',
    type: 'color',
    group: 'action',
    value: '#1e961e',
    global: false,
  },
  styleGuide1_brand_primary: {
    type: 'color',
    group: 'brand',
    name: 'Primary',
    value: '#ff0000',
    global: false,
  },
  styleGuide1_brand_secondary: {
    name: 'Secondary',
    type: 'color',
    group: 'brand',
    value: '#d42828',
    global: false,
  },
  styleGuide1_brand_tertiary: {
    name: 'Tertiary',
    type: 'color',
    group: 'brand',
    value: '#af2323',
    global: false,
  },
}

export default {
  title: 'Forms/Theme Value',
  args: {
    samples: [
      {
        formData: {
          identifier: {
            designToken: 'dtActionBg',
            theme: 'styleGuide1_light',
          },
          styles,
          type: 'color',
          medias: ['default'],
          fields: {
            media: 'default',
            style: 'styleGuide1_action_primary',
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {
          identifier: {
            designToken: 'dtActionBg',
            theme: 'styleGuide1_light',
            media: 'default',
          },
          styles,
          type: 'color',
          medias: ['default'],
          fields: {
            media: 'default',
            style: 'styleGuide1_action_primary',
          },
        },
        onAction: action('triggered action'),
      },
      {
        formData: {},
        onAction: action('triggered action'),
      },
    ],
  },
}

export const themeValue = ({ samples }) => {
  return (
    <div>
      <div class="header">
        <h1>Theme Value Form</h1>
      </div>
      <div
        class="content"
        style={{
          display: 'grid',
          gridTemplateColumns: '500px 500px',
          gridAutoRows: '300px',
          gap: '1rem',
        }}
      >
        {samples.map((args) => (
          <Fragment>
            <div class="tf-light" style={{ background: '#fff', padding: '1rem' }}>
              <tf-theme-value-form {...args} />
            </div>
            <div style={{ padding: '1rem' }}>
              <tf-theme-value-form {...args} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
