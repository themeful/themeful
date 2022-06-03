import { AliasTokens, DesignTokens, StyleGuides, Themes } from '@typings'

export const themes: Themes = {
  styleGuide1_light: {
    name: 'Light',
    styleGuide: 'styleGuide1',
    styles: {
      dtActionBG: {
        default: {
          style: 'styleGuide1_brand_secondary',
        },
      },
      dtFontColorPrimary: {
        default: {
          style: 'global_base_black',
        },
      },
      dtFontSize100: {
        default: {
          style: 'styleGuide1_fontSize_primary',
        },
      },
    },
  },
  styleGuide1_dark: {
    name: 'Dark',
    styleGuide: 'styleGuide1',
    styles: {
      dtActionBG: {
        default: {
          style: 'styleGuide1_brand_secondary',
        },
      },
      dtFontColorPrimary: {
        default: {
          style: 'global_base_white',
        },
      },
      dtFontSize100: {
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
      dtActionBG: {
        default: {
          style: 'styleGuide2_brand_primary',
        },
      },
      dtFontColorPrimary: {
        default: {
          style: 'global_base_black',
        },
      },
      dtFontSize100: {
        default: {
          style: 'styleGuide2_fontSize_normal',
        },
      },
    },
  },
  styleGuide2_dark: {
    name: 'Dark',
    styleGuide: 'styleGuide2',
    styles: {
      dtActionBG: {
        default: {
          style: 'styleGuide2_brand_secondary',
        },
      },
      dtFontColorPrimary: {
        default: {
          style: 'global_base_white',
        },
      },
      dtFontSize100: {
        default: {
          style: 'styleGuide2_fontSize_normal',
        },
      },
    },
  },
}

export const styleGuides: StyleGuides = {
  global: {
    name: 'Global',
    baseFontSize: 16,
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
    baseFontSize: 16,
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
}

export const designTokens: DesignTokens = {
  dtTestActionBackground: {
    type: 'color',
    name: 'Action Background',
    group: 'controls',
    description: 'Background for action elements',
    properties: ['color', 'background-color'],
    aliasTokens: ['atButtonBackground'],
  },
  dtTestFontColorPrimary: {
    type: 'color',
    name: 'Normal Font Color',
    group: 'content',
    description: 'Font color for normal text',
    properties: ['color'],
    aliasTokens: ['atBaseFontColor', 'atButtonFontColor'],
  },
  dtTestFontSize100: {
    type: 'font-size',
    name: 'Normal Font Size',
    group: 'content',
    description: 'Font size for normal text',
    properties: ['font-size'],
    aliasTokens: ['atButtonFontSize'],
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
