import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const PACKAGE_NAME = 'rateli';
const DIST_FOLDER_FILENAME = `dist/${PACKAGE_NAME}`;

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
});

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `${DIST_FOLDER_FILENAME}.cjs`,
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: `${DIST_FOLDER_FILENAME}.mjs`,
        format: 'es',
        sourcemap: false,
      }
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${DIST_FOLDER_FILENAME}.d.ts`,
      format: 'es',
    },
  }),
];
