const path = require('path');
const { defineConfig } = require('vitest/config');
const react = require('@vitejs/plugin-react');

// Test-only config, independent of the app's actual Webpack build
// (webpack/webpack.*.js) — Vitest just needs its own transform/resolve
// pipeline for running tests, not for producing the shipped bundle.
module.exports = defineConfig({
  // @vitejs/plugin-react's own Babel pass only ever applies extras (fast
  // refresh, dev-mode jsx-self/jsx-source) on top of an already-JSX-free
  // file — the actual JSX-to-JS compilation for plain source files is
  // Vite core's *separate* `vite:esbuild` transform plugin, configured
  // below. Plugin defaults are fine here.
  plugins: [react()],
  resolve: {
    // Mirrors webpack.common.js's `resolve.alias: { app: 'app' }`, which
    // lets source files `import ... from 'app/...'` instead of relative
    // paths back up to client/app.
    alias: {
      app: path.resolve(__dirname, 'app')
    }
  },
  esbuild: {
    // Components (and tests) in this codebase are plain `.js` files
    // containing JSX (a Create-React-App-era convention), not `.jsx` —
    // Vite core's esbuild transform plugin only parses JSX in `.jsx`/
    // `.tsx` by default, so `.js` needs to opt in via `loader`+`include`.
    //
    // CAUTION: Vite's esbuild plugin builds its file filter as
    // `createFilter(include || /\.(m?ts|[jt]sx)$/, exclude || /\.js$/)` —
    // if `exclude` is left unset here, it silently defaults to excluding
    // *every* `.js` file, which always wins over `include` and makes this
    // whole option a silent no-op. `exclude` must be explicitly emptied.
    loader: 'jsx',
    // Broadened from /app\/.*\.js$/ once client/tests/renderWithProviders.js
    // (outside app/) started being imported by container tests and hit the
    // same "invalid JS syntax" failure this include/exclude pair exists to
    // prevent — any .js file under the project (other than node_modules)
    // may contain JSX, not just ones under app/.
    include: /\.js$/,
    exclude: [/node_modules/]
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(__dirname, 'tests/setup.js')],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['app/**/*.js'],
      exclude: ['app/**/*.test.js', 'app/**/*.json'],
      thresholds: {
        lines: 100
      }
    }
  }
});
