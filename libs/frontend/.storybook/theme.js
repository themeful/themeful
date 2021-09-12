import { create } from '@storybook/theming'
import themefulLogo from './themeful.svg'

export default create({
  base: 'light',
  brandTitle: 'themeful',
  brandUrl: 'https://themeful.io/',
  brandImage: themefulLogo,
  colorSecondary: '#4671D5',
})

// export default create({
//   base: 'light',

//   colorPrimary: 'hotpink',
//   colorSecondary: 'deepskyblue',

//   // UI
//   appBg: 'white',
//   appContentBg: 'silver',
//   appBorderColor: 'grey',
//   appBorderRadius: 4,

//   // Typography
//   fontBase: '"Open Sans", sans-serif',
//   fontCode: 'monospace',

//   // Text colors
//   textColor: 'black',
//   textInverseColor: 'rgba(255,255,255,0.9)',

//   // Toolbar default and active colors
//   barTextColor: 'silver',
//   barSelectedColor: 'black',
//   barBg: 'hotpink',

//   // Form colors
//   inputBg: 'white',
//   inputBorder: 'silver',
//   inputTextColor: 'black',
//   inputBorderRadius: 4,

//   brandTitle: 'My custom storybook',
//   brandUrl: 'https://example.com',
//   brandImage: 'https://place-hold.it/350x150',
// });
