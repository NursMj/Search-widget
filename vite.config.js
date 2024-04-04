import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte({
			include: ['src/**/*.svelte'],
			exclude: ['src/CustomElements/SearchWidget.svelte'],
		}),
		svelte({
			include: ['src/CustomElements/SearchWidget.svelte'],
			compilerOptions: {
				customElement: true,
			},
		}),
	],
});
