import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { MultiSelectInputComponent } from '../../components/inputs/multi-select-input/multi-select-input.component'
import { DesignTokenSplitFormComponent } from './design-token-split-form.component'

describe('DesignTokenSplitFormComponent', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: 'dtActionBg',
        aliasTokens: ['atCardBackground', 'atButtonBackground'],
        fields: { selected: [] },
      },
    }
    const page = await newSpecPage({
      components: [DesignTokenSplitFormComponent, ButtonComponent, MultiSelectInputComponent],
      autoApplyChanges: true,
      template: () => <tf-design-token-split-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
