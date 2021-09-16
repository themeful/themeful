import { newSpecPage } from '@stencil/core/testing'
import { AliasTokenFormComponent } from './alias-token-form.component'

describe('alias-token-form', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [AliasTokenFormComponent],
      html: '<tf-alias-token-select></alias-token-form>',
    })
    expect(root).toEqualHtml(`
      <tf-alias-token-select>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </alias-token-form>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [AliasTokenFormComponent],
      html: `<tf-alias-token-select first="Stencil" last="'Don't call me a framework' JS"></alias-token-form>`,
    })
    expect(root).toEqualHtml(`
      <tf-alias-token-select first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </alias-token-form>
    `)
  })
})
