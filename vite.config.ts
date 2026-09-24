/// <reference types="vitest/config" />
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Library build: one ES module with `vue` left external and every component's
// CSS Module extracted into a single dist/style.css.
export default defineConfig({
  plugins: [vue()],
  css: {
    modules: { generateScopedName: 'av_[name]__[local]__[hash:base64:5]' },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: { external: ['vue'] },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
})
