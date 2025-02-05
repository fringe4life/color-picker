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
  resolve: {
    alias: {
      "$lib": path.resolve("./src/lib"),
      "$lib/components": path.resolve("./src/lib/components"),
    },
  },
  plugins: [svelte(svelteConfig), tailwindcss()],
});
