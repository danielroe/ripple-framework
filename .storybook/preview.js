import { RplIconSprite } from '@dpc-sdp/ripple-ui-core'
import rplVuePlugin from '@dpc-sdp/ripple-ui-core/plugin'
import { registerRplFormPlugin } from '@dpc-sdp/ripple-ui-forms'
import '@dpc-sdp/ripple-ui-core/style'
import { withCssResources } from '@storybook/addon-cssresources'
import { withDesign } from 'storybook-addon-designs'
import { app } from '@storybook/vue3'
import themes from './themes.json'
import withBackground from './utils/withBackground'
// Storybook specific CSS
import './storybook.css'

// Add SVG based image placeholder for use in all stories
import svgPlaceholder from '~/storybook/utils/svgPlaceholder'
window.svgPlaceholder = svgPlaceholder

// Ripple vue plugins
registerRplFormPlugin(app)
app.use(rplVuePlugin)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: ['Base Styles', 'Core', '*', 'WIP']
    }
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  backgrounds: {
    disable: true
  },
  designTokensCss: {
    label: 'Themes',
    persistData: true,
    themes
  }
}

export const decorators = [
  withCssResources,
  (story) => ({
    components: { story, RplIconSprite },
    template: '<div><RplIconSprite /><story /></div>'
  }),
  withBackground,
  withDesign
]
