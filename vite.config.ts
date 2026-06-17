/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), glsl()],
  base: './',
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@config': resolve(__dirname, 'src/config'),
      '@models': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@shaders': resolve(__dirname, 'src/shaders')
    }
  },
  assetsInclude: ['**/*.stl',
  // STereoLithography
  '**/*.mp3',
  // STereoLithography
  '**/*.svg',
  // STereoLithography
  '**/*.glb',
  // GL Binary (GLTF)
  '**/*.gltf',
  // GL Transmission Format
  '**/*.fbx',
  // Filmbox
  '**/*.obj',
  // Wavefront OBJ
  '**/*.dae',
  // COLLADA
  '**/*.ply',
  // Polygon File Format
  '**/*.png' // Polygon File Format
  ],
  minify: false,
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});