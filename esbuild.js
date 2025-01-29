import fileloc from 'esbuild-plugin-fileloc';
import { clean } from 'esbuild-plugin-clean';
import copyFilePlugin from 'esbuild-plugin-copy-file';
import esbuild from 'esbuild';

const banner = `
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
`;

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    platform: 'node',
    target: 'node20',
    bundle: true,
    plugins: [
      clean({
        patterns: ['./dist/*']
      }),
      fileloc.filelocPlugin(),
      copyFilePlugin({
        after: {
          './dist/package.json': './package.json'
        }
      })
    ],
    loader: {
      '.ts': 'ts',
      '.js': 'js',
      '.cjs': 'js'
    },
    outdir: 'dist',
    external: ['package.json'],
    minify: true,
    sourcemap: true,
    format: 'esm',
    banner: {
      js: banner
    }
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
