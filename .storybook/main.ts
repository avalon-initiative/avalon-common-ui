import type { StorybookConfig } from '@storybook/vue3-vite'

// The Vue plugin and SCSS/CSS-modules settings come from the root vite.config.ts.
const config: StorybookConfig = {
  stories: ['../src/stories/*.stories.ts'],
  framework: '@storybook/vue3-vite',
}
export default config
