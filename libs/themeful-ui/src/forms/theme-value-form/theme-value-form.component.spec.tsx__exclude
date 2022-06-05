import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { SelectInputComponent } from '../../components/inputs/select-input/select-input.component'
import { SuggestInputComponent } from '../../components/inputs/suggest-input/suggest-input.component'
import { TextInputComponent } from '../../components/inputs/text-input/text-input.component'
import { ThemeValueFormComponent } from './theme-value-form.component'

describe('ThemeValueFormComponent', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: {
          designToken: 'dtActionBg',
          theme: 'styleGuide1_light',
          media: 'global_mediaQuery_aboveMobile',
        },
        styles,
        type: 'color',
        medias,
        fields: {
          media: 'global_mediaQuery_aboveMobile',
          style: 'styleGuide1_action_primary',
        },
      },
    }
    const page = await newSpecPage({
      components: [
        ThemeValueFormComponent,
        SuggestInputComponent,
        TextInputComponent,
        ButtonComponent,
        SelectInputComponent,
      ],
      autoApplyChanges: true,
      template: () => <tf-theme-value-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})

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
}

const medias = [
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
]
