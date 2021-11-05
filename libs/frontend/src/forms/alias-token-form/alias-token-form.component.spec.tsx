import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { ButtonComponent } from '../../components/button/button.component'
import { MultiSelectInputComponent } from '../../components/inputs/multi-select-input/multi-select-input.component'
import { AliasTokenFormComponent } from './alias-token-form.component'

describe('alias-token-form', () => {
  it('renders', async () => {
    const data = {
      formData: {
        identifier: 'dtActionBg',
        aliasTokens: ['atCardBackground', 'atButtonBackground'],
        fields: {},
      },
    }
    const page = await newSpecPage({
      components: [AliasTokenFormComponent, ButtonComponent, MultiSelectInputComponent],
      autoApplyChanges: true,
      template: () => <tf-alias-token-select {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })

  it('renders with values', async () => {
    const data = {
      formData: {
        identifier: 'dtActionBg',
      },
    }
    const page = await newSpecPage({
      components: [AliasTokenFormComponent, ButtonComponent, MultiSelectInputComponent],
      autoApplyChanges: true,
      template: () => <tf-alias-token-select {...data} />,
    })

    expect(page.root).toMatchSnapshot()
  })
})
