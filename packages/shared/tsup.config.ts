import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  // Nest에서 class-validator 데코레이터 쓰면 유지
  esbuildOptions(options) {
    options.keepNames = true;
  },
});
