import '!style-loader!css-loader!sass-loader!./styles.scss'
import { getHostRef, registerHost, renderVdom } from '@stencil/core/internal/client'
import { defineCustomElements } from '../../../dist/libs/ui-lib/loader'

defineCustomElements()

const rootElement = document.getElementById('root')
const storyRoot = document.createElement('div')
rootElement.parentElement.appendChild(storyRoot)

registerHost(storyRoot, { $flags$: 0, $tagName$: 'story-root' })
const hostRef = getHostRef(storyRoot)

export const decorators = [
  (Story) => {
    renderVdom(hostRef, Story())
    return '<div />'
  },
]

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Pages', 'Form Integration', 'Forms', 'Components'],
    },
  },
}
