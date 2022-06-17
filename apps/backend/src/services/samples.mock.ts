import { AliasTokens, DesignTokens, FormatedStyleGuides, StyleGuides, Themes } from '@typings'

export const config = {
  paths: {
    generatedPath: './test-sample/generated/',
    dataPath: './test-sample/generated/',
    themesPath: './test-sample/generated/',
    libPath: './test-sample/components/',
  },
  global: {
    baseFontSize: 16,
    shortDesignTokens: false,
  },
}

export const styleGuidesApi: FormatedStyleGuides = [
  {
    baseFontSize: 12,
    name: 'Global',
    slug: 'global',
    types: [
      {
        groups: [
          {
            name: 'Base',
            styles: [
              { group: 'Base', name: 'Black', slug: 'base_black', type: 'color', value: '#333333' },
              { group: 'Base', name: 'Light', slug: 'base_light', type: 'color', value: '#ffffff' },
            ],
          },
        ],
        name: 'Color',
      },
      {
        groups: [
          {
            name: 'Media query',
            styles: [
              {
                group: 'Media query',
                name: 'Above Desktop',
                slug: 'mediaQuery_aboveDesktop',
                type: 'mediaquery',
                value: 'screen and (min-width: 1200px)',
              },
              {
                group: 'Media query',
                name: 'Above Small Mobile',
                slug: 'mediaQuery_aboveSmallMobile',
                type: 'mediaquery',
                value: 'screen and (min-width: 321px)',
              },
            ],
          },
        ],
        name: 'MediaQuery',
      },
    ],
  },
  {
    baseFontSize: 12,
    name: 'StyleGuide 1',
    slug: 'styleGuide1',
    types: [
      {
        groups: [
          {
            name: 'Action',
            styles: [
              {
                group: 'Action',
                name: 'Primary',
                slug: 'action_primary',
                type: 'color',
                value: '#31ed31',
              },
              {
                group: 'Action',
                name: 'Secondary',
                slug: 'action_secondary',
                type: 'color',
                value: '#2ec22e',
              },
              {
                group: 'Action',
                name: 'Tertiary',
                slug: 'action_tertiary',
                type: 'color',
                value: '#1e961e',
              },
            ],
          },
        ],
        name: 'Color',
      },
      {
        groups: [
          {
            name: 'Base',
            styles: [
              {
                group: 'Base',
                name: 'Secondary',
                slug: 'base_secondary',
                type: 'size',
                value: '32px',
              },
            ],
          },
          {
            name: 'Font size',
            styles: [
              {
                group: 'Font size',
                name: 'Primary',
                slug: 'fontSize_primary',
                type: 'size',
                value: '32px',
              },
            ],
          },
        ],
        name: 'Size',
      },
    ],
  },
  {
    baseFontSize: 16,
    name: 'StyleGuide 2',
    slug: 'styleGuide2',
    types: [
      {
        groups: [
          {
            name: 'Action',
            styles: [
              {
                group: 'Action',
                name: 'Primary',
                slug: 'action_primary',
                type: 'color',
                value: '#ff5555',
              },
              {
                group: 'Action',
                name: 'Secondary',
                slug: 'action_secondary',
                type: 'color',
                value: '#d22828',
              },
            ],
          },
        ],
        name: 'Color',
      },
    ],
  },
  {
    baseFontSize: 10,
    name: 'StyleGuide 3',
    slug: 'styleGuide3',
    types: [
      {
        groups: [
          {
            name: 'Base',
            styles: [
              {
                group: 'Base',
                name: 'Primary',
                slug: 'base_primary',
                type: 'color',
                value: '#2be053',
              },
            ],
          },
        ],
        name: 'Color',
      },
    ],
  },
  { baseFontSize: 10, name: 'StyleGuide 4', slug: 'styleGuide4', types: [] },
]

export const themes: Themes = {
  styleGuide1_light: {
    name: 'Light',
    styleGuide: 'styleGuide1',
    styles: {
      dtTestActionBackground: {
        default: {
          style: 'styleGuide1_action_primary',
        },
      },
      dtTestFontColorPrimary: {
        default: {
          style: 'global_base_black',
        },
        global_mediaQuery_notInStyleGuide: {
          style: 'styleGuide1_action_primary',
        },
      },
      dtTestFontSize100: {
        default: {
          direct: {
            value: '12px',
            type: 'font-size',
          },
        },
        global_mediaQuery_notInStyleGuide: {
          style: 'styleGuide1_fontSize_primary',
        },
        global_mediaQuery_aboveDesktop: {
          direct: {
            value: '13px',
            type: 'font-size',
          },
        },
      },
    },
  },
  styleGuide1_dark: {
    name: 'Dark',
    styleGuide: 'styleGuide1',
    styles: {
      dtTestActionBackground: {
        default: {
          style: 'styleGuide1_action_primary',
        },
      },
      dtTestFontColorPrimary: {
        default: {
          style: 'global_base_light',
        },
      },
      dtTestFontSize100: {
        default: {
          style: 'styleGuide1_fontSize_primary',
        },
      },
    },
  },
  styleGuide2_light: {
    name: 'Light',
    styleGuide: 'styleGuide2',
    styles: {
      dtTestActionBackground: {
        default: {
          style: 'styleGuide2_action_secondary',
        },
      },
      dtTestFontColorPrimary: {
        default: {
          style: 'global_base_black',
        },
      },
      dtTestFontSize100: {
        default: {
          style: 'styleGuide2_fontSize_primary',
        },
      },
    },
  },
  styleGuide2_dark: {
    name: 'Dark',
    styleGuide: 'styleGuide2',
    styles: {
      dtTestActionBackground: {
        default: {
          style: 'styleGuide2_brand_secondary',
        },
      },
      dtTestFontColorPrimary: {
        default: {
          style: 'global_base_light',
        },
      },
      dtTestFontSize100: {
        default: {
          style: 'styleGuide2_fontSize_primary',
        },
      },
    },
  },
}

export const styleGuides: StyleGuides = {
  global: {
    name: 'Global',
    baseFontSize: 12,
    styles: {
      base_black: {
        name: 'Black',
        type: 'color',
        group: 'Base',
        slug: 'base_black',
        value: '#333333',
      },
      base_light: {
        name: 'Light',
        type: 'color',
        group: 'Base',
        slug: 'base_light',
        value: '#ffffff',
      },
      mediaQuery_aboveDesktop: {
        name: 'Above Desktop',
        type: 'mediaquery',
        group: 'Media query',
        slug: 'mediaQuery_aboveDesktop',
        value: 'screen and (min-width: 1200px)',
      },
      mediaQuery_aboveSmallMobile: {
        name: 'Above Small Mobile',
        type: 'mediaquery',
        group: 'Media query',
        slug: 'mediaQuery_aboveSmallMobile',
        value: 'screen and (min-width: 321px)',
      },
    },
  },
  styleGuide1: {
    name: 'StyleGuide 1',
    baseFontSize: 12,
    styles: {
      action_primary: {
        name: 'Primary',
        type: 'color',
        group: 'Action',
        slug: 'action_primary',
        value: '#31ed31',
      },
      action_secondary: {
        name: 'Secondary',
        type: 'color',
        group: 'Action',
        slug: 'action_secondary',
        value: '#2ec22e',
      },
      action_tertiary: {
        name: 'Tertiary',
        type: 'color',
        group: 'Action',
        slug: 'action_tertiary',
        value: '#1e961e',
      },
      base_secondary: {
        name: 'Secondary',
        type: 'size',
        group: 'base',
        slug: 'base_secondary',
        value: '32px',
      },
      fontSize_primary: {
        name: 'Primary',
        type: 'size',
        group: 'fontSize',
        slug: 'fontSize_primary',
        value: '32px',
      },
    },
  },
  styleGuide2: {
    name: 'StyleGuide 2',
    baseFontSize: 16,
    styles: {
      action_primary: {
        name: 'Primary',
        type: 'color',
        group: 'Action',
        slug: 'action_primary',
        value: '#ff5555',
      },
      action_secondary: {
        name: 'Secondary',
        type: 'color',
        group: 'Action',
        slug: 'action_secondary',
        value: '#d22828',
      },
    },
  },
  styleGuide3: {
    name: 'StyleGuide 3',
    baseFontSize: 10,
    styles: {
      base_primary: {
        name: 'Primary',
        type: 'color',
        group: 'Base',
        slug: 'base_primary',
        value: '#2be053',
      },
    },
  },
  styleGuide4: {
    name: 'StyleGuide 4',
    baseFontSize: 10,
    styles: {},
  },
}

export const designTokens: DesignTokens = {
  dtTestActionBackground: {
    type: 'color',
    name: 'Action Background',
    group: 'controls',
    description: 'Background for action elements',
    properties: ['color', 'background-color'],
    aliasTokens: ['atButtonBackground'],
    short: 'd12',
  },
  dtTestFontColorPrimary: {
    type: 'color',
    name: 'Normal Font Color',
    group: 'content',
    description: 'Font color for normal text',
    properties: ['color'],
    aliasTokens: ['atTestBaseFontColor', 'atTestButtonFontColor'],
    short: 'd34',
  },
  dtTestFontSize100: {
    type: 'font-size',
    name: 'Normal Font Size',
    group: 'content',
    description: 'Font size for normal text',
    properties: ['font-size'],
    aliasTokens: ['atButtonFontSize'],
    short: 'd56',
  },
}

export const aliasTokens: AliasTokens = {
  atTestButtonBackground: {
    component: ['Button'],
    files: ['libs/components/src/lib/button/button.component.scss'],
    properties: ['background-color'],
    extern: false,
    crawled: true,
  },
  atTestButtonFontSize: {
    component: ['Button'],
    files: ['libs/components/src/lib/button/button.component.scss'],
    properties: ['font-size'],
    extern: false,
    crawled: true,
  },
  atTestButtonFontColor: {
    component: ['Button'],
    files: ['libs/components/src/lib/button/button.component.scss'],
    properties: ['color'],
    extern: true,
    crawled: true,
  },
  atTestBaseFontColor: {
    component: [],
    files: [],
    properties: ['color'],
    extern: true,
    crawled: false,
  },
}
