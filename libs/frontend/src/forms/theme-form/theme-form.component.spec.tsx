import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { SelectInputComponent } from '../../components/inputs/select-input/select-input.component'
import { TextInputComponent } from '../../components/inputs/text-input/text-input.component'
import { ThemeFormComponent } from './theme-form.component'

describe('ThemeFormComponent', () => {
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
      components: [ThemeFormComponent, ButtonComponent, SelectInputComponent, TextInputComponent],
      autoApplyChanges: true,
      template: () => <tf-theme-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
