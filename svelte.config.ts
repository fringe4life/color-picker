import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import path from 'node:path'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  resolve: {
        alias: {
          $lib: path.resolve('./src/lib'),
          $components: path.resolve('./src/components')
        }
      }
}
