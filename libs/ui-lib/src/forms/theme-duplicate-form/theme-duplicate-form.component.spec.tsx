import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { SelectInputComponent } from '../../components/inputs/select-input/select-input.component'
import { TextInputComponent } from '../../components/inputs/text-input/text-input.component'
import { ThemeDuplicateComponent } from './theme-duplicate-form.component'

describe('ThemeDuplicateComponent', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: 'some_theme',
        styleGuides: [
          { key: 'first', value: 'First' },
          { key: 'second', value: 'Second' },
        ],
        fields: { name: 'name', styleGuide: 'second' },
      },
    }
    const page = await newSpecPage({
      components: [
        ThemeDuplicateComponent,
        ButtonComponent,
        SelectInputComponent,
        TextInputComponent,
      ],
      autoApplyChanges: true,
      template: () => <tf-theme-duplicate-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
