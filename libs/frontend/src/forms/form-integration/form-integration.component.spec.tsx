import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { DesignTokenIntegration } from '@typings'
import { Subject } from 'rxjs'
import { OverlayComponent } from '../../components/overlay/overlay.component'
import { FormIntegrationComponent } from './form-integration.component'

describe('FormIntegrationComponent', () => {
  it('renders', async () => {
    const subject = new Subject<DesignTokenIntegration>()
    const data = {
      form: 'designToken',
      identifier: 'dtActionBg',
      groups: ['First', 'Second'],
      propertyTypes: [
        { key: 'size', value: 'Size' },
        { key: 'color', value: 'Color' },
      ],
      fields: {
        name: 'Some Token Name',
        group: 'First',
        type: 'color',
        description: 'Some good description',
      },
    }
    const page = await newSpecPage({
      components: [FormIntegrationComponent, OverlayComponent],
      autoApplyChanges: true,
      template: () => <tf-form-integration formData$={subject} />,
    })

    subject.next(data as DesignTokenIntegration)
    subject.complete()
    expect(page.root).toMatchSnapshot()
  })
})
