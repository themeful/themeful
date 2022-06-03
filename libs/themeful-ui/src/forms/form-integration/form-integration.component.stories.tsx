/* eslint-disable react/jsx-no-bind */
import { propertySelect } from '@properties'
import { h } from '@stencil/core'
import { action } from '@storybook/addon-actions'
import { Subject } from 'rxjs'

const triggerOverlay = new Subject()
const openOverlay = (form) => {
  triggerOverlay.next(formDatas[form])
}
const groups = ['First Group', 'Second Group', 'Third Group']

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

const formDatas = {
  styleguideDuplicate: {
    form: 'styleguideDuplicate',
    identifier: 'styleGuide1',
    fields: {
      name: 'Style Guide 1',
    },
  },
  styleguide: {
    form: 'styleguide',
    identifier: 'styleGuide1',
    fields: {
      name: 'StyleGuide Name',
      baseFontSize: 16,
    },
  },
  style: {
    form: 'style',
    identifier: { styleguide: 'styleGuide1', style: 'baseGroup_red' },
    groups,
    propertyTypes: propertySelect,
    fields: {
      type: 'color',
      group: 'Base Group',
      name: 'Red',
      value: '#ff0000',
    },
  },
  designToken: {
    form: 'designToken',
    identifier: 'dtSomeTokenName',
    groups,
    propertyTypes: propertySelect,
    fields: {
      name: 'Some Token Name',
      group: 'Base',
      type: 'color',
      description: 'Some good description',
    },
  },
  themeValue: {
    form: 'themeValue',
    identifier: {
      designToken: 'dtActionBg',
      theme: 'styleGuide1_light',
      media: 'default',
    },
    styles,
    type: 'color',
    medias: [
      {
        key: 'default',
        value: 'Default',
      },
      {
        key: 'global_mediaQuery_aboveSmallMobile',
        value: 'Above Small Mobile',
      },
      {
        key: 'global_mediaQuery_aboveMobile',
        value: 'Above Mobile',
      },
      {
        key: 'global_mediaQuery_aboveTablet',
        value: 'Above Tablet',
      },
      {
        key: 'global_mediaQuery_aboveDesktop',
        value: 'Above Desktop',
      },
    ],
    fields: {
      media: 'default',
      style: 'styleGuide1_action_primary',
    },
  },
  theme: {
    form: 'theme',
    identifier: 'styleGuide1_dark',
    styleGuides: [
      { key: 'styleGuide1', value: 'Style Guide 1' },
      { key: 'styleGuide2', value: 'Style Guide 2' },
    ],
    fields: {
      name: 'Dark',
      styleGuide: 'styleGuide1',
    },
  },
  aliasTokenSelect: {
    form: 'aliasTokenSelect',
    identifier: 'dtActionBg',
    aliasTokens: ['atCardBackground'],
    fields: {
      selected: ['atButtonBackground'],
    },
  },
  empty: {
    form: 'empty',
  },
}

export default {
  title: 'Form Integration/All Forms',
}

export const allForms = (args) => {
  return (
    <div>
      <div class="header">
        <h1>Form Integration</h1>
      </div>
      <div class="content">
        <div
          style={{
            width: '100%',
            display: 'grid',
            gap: '16px',
            justifyContent: 'center',
            justifyItems: 'center',
            gridTemplateColumns: '1fr 1fr 1fr',
          }}
        >
          <tf-button onClick={() => openOverlay('styleguide')}>Open Style Guide Form</tf-button>
          <tf-button onClick={() => openOverlay('style')}>Open Style Form</tf-button>
          <tf-button onClick={() => openOverlay('theme')}>Open Theme Form</tf-button>
          <tf-button onClick={() => openOverlay('themeValue')}>Open Theme Value Form</tf-button>
          <tf-button onClick={() => openOverlay('designToken')}>Open Design Token Form</tf-button>
          <tf-button onClick={() => openOverlay('aliasTokenSelect')}>
            Open Alias Token Form
          </tf-button>
          <tf-button onClick={() => openOverlay('styleguideDuplicate')}>
            Open Style Guide Duplicate Form
          </tf-button>
          <tf-button onClick={() => openOverlay('empty')}>Open Empty</tf-button>
        </div>
        <tf-form-integration {...args} />
      </div>
    </div>
  )
}

allForms.args = {
  formData$: triggerOverlay,
  onAction: action('triggered action'),
}
