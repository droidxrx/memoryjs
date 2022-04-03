import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-ts';

export default defineConfig({
	input: './src/index.ts',
	output: [
		{
			file: './dist/index.js',
			strict: false,
			format: 'commonjs',
			exports: 'named',
			esModule: false,
			interop: false,
		},
		{
			file: './dist/index.mjs',
		},
	],
	external: [/node_modules/, /build/],
	plugins: [nodeResolve({ extensions: ['.ts'] }), ts({ transpileOnly: true, tsconfig: './tsconfig.json' })],
	watch: {
		include: './src/*.ts',
		clearScreen: true,
	},
});
