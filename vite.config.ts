import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default () => {
  process.env = { ...process.env, ...loadEnv('', process.cwd()) }

  return defineConfig({
    plugins: [
      react(),
      nodePolyfills({
        include: ['crypto', 'process', 'stream', 'util'],
        globals: { global: true, process: true },
      }),
    ],
  })
}
