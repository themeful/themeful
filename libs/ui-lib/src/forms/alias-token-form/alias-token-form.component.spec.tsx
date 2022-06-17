import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { MultiSelectInputComponent } from '../../components/inputs/multi-select-input/multi-select-input.component'
import { AliasTokenFormComponent } from './alias-token-form.component'

describe('AliasTokenFormComponent', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: 'dtActionBg',
        aliasTokens: ['atCardBackground', 'atButtonBackground'],
        fields: { selected: [] },
      },
    }
    const page = await newSpecPage({
      components: [AliasTokenFormComponent, ButtonComponent, MultiSelectInputComponent],
      autoApplyChanges: true,
      template: () => <tf-alias-token-form {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
