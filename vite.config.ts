import { defineConfig } from 'vite'
// svelte imports
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svelteConfig from './svelte.config.ts';
// tailwindcss imports
import tailwindcss from '@tailwindcss/vite';
// node imports
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(svelteConfig), tailwindcss()],
  build: {
    minify: 'terser',
    cssMinify: true,
    terserOptions: {
      compress: {
        passes: 3,
        drop_console: true,
        drop_debugger: true,
        ecma: 2020
      },
      output: {
        comments: false,
      },
      mangle: {
        toplevel: true,
      }
    },
    rollupOptions: {
      input: [
        path.resolve(__dirname, "index.html"),
      ]
    }
  }
});
