import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { ColorInputComponent } from '../../components/inputs/color-input/color-input.component'
import { SelectInputComponent } from '../../components/inputs/select-input/select-input.component'
import { SuggestInputComponent } from '../../components/inputs/suggest-input/suggest-input.component'
import { TextInputComponent } from '../../components/inputs/text-input/text-input.component'
import { StyleFormComponent } from './style-form.component'

describe('StyleFormComponent', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: { styleGuide: 'styleGuide1', style: 'baseGroup_red' },
        groups: ['First', 'Second'],
        propertyTypes: [
          { key: 'first', value: 'First' },
          { key: 'second', value: 'Second' },
        ],
        fields: {
          type: 'color',
          group: 'Base Group',
          name: 'Red',
          value: '#4b83be',
        },
      },
    }
    const page = await newSpecPage({
      components: [
        StyleFormComponent,
        SuggestInputComponent,
        TextInputComponent,
        ButtonComponent,
        SelectInputComponent,
        ColorInputComponent,
      ],
      autoApplyChanges: true,
      template: () => <tf-style-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
