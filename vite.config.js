import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

// import basicSsl from "@vitejs/plugin-basic-ssl";
// import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	// plugins: [sveltekit(), mkcert()],
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
	// server: {
	// 	https: true
	// }
})
