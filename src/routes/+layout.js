import { storyblokInit, apiPlugin } from '@storyblok/svelte'
import { PUBLIC_STORYBLOK_ACCESS_TOKEN_PREVIEW } from '$env/static/public'

// https://www.storyblok.com/tp/add-a-headless-cms-to-svelte-in-5-minutes
export async function load() {
	storyblokInit({
		accessToken: PUBLIC_STORYBLOK_ACCESS_TOKEN_PREVIEW,
		// bridge: false,
		use: [apiPlugin],
		apiOptions: {
			https: true
		}
	})
}
