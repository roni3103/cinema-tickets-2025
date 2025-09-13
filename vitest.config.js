import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    // Transpile all files with ESBuild to remove comments from code coverage.
    // Required for `test.coverage.ignoreEmptyLines` to work:
    include: ['**/*.js'],
  },  
  test: {
    coverage: {
      provider: 'v8', // instead of 'istanbul'
      reporter: ['text', 'html'],
            ignoreEmptyLines: true,

    },
  },
});