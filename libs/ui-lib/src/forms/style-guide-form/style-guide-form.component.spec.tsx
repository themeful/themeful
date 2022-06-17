import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { TextInputComponent } from '../../components/inputs/text-input/text-input.component'
import { StyleGuideFormComponent } from './style-guide-form.component'

describe('StyleGuideFormComponent', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: 'styleGuide1',
      },
    }
    const page = await newSpecPage({
      components: [StyleGuideFormComponent, TextInputComponent, ButtonComponent],
      autoApplyChanges: true,
      template: () => <tf-style-guide-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
