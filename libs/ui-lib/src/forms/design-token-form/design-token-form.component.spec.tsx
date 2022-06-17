import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { SelectInputComponent } from '../../components/inputs/select-input/select-input.component'
import { SuggestInputComponent } from '../../components/inputs/suggest-input/suggest-input.component'
import { TextInputComponent } from '../../components/inputs/text-input/text-input.component'
import { DesignTokenFormComponent } from './design-token-form.component'

describe('DesignTokenFormComponent', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: 'dtActionBg',
        groups: ['First', 'Second'],
        propertyTypes: [
          { key: 'first', value: 'First' },
          { key: 'second', value: 'Second' },
        ],
      },
    }
    const page = await newSpecPage({
      components: [
        DesignTokenFormComponent,
        SuggestInputComponent,
        TextInputComponent,
        ButtonComponent,
        SelectInputComponent,
      ],
      autoApplyChanges: true,
      template: () => <tf-design-token-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
