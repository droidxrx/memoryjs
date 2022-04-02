import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-ts';

export default defineConfig({
	input: './src/index.ts',
	output: {
		file: './dist/index.js',
		strict: false,
		format: 'cjs',
		interop: true,
		exports: 'auto',
		esModule: true,
	},
	external: [/node_modules/],
	plugins: [nodeResolve({ extensions: ['.ts', '.node'] }), ts({ transpileOnly: true, tsconfig: './tsconfig.json' })],
	watch: {
		include: './src/*.ts',
		clearScreen: true,
	},
});
