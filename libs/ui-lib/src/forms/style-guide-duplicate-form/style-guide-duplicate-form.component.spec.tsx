import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { TextInputComponent } from '../../components/inputs/text-input/text-input.component'
import { StyleGuideDuplicateFormComponent } from './style-guide-duplicate-form.component'

describe('StyleGuideDuplicateFormComponent', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: 'styleGuide1',
        fields: { name: 'Style Guide 1' },
      },
    }
    const page = await newSpecPage({
      components: [StyleGuideDuplicateFormComponent, TextInputComponent, ButtonComponent],
      autoApplyChanges: true,
      template: () => <tf-style-guide-duplicate-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
