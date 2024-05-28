import { storyblokInit, apiPlugin, useStoryblokApi } from '@storyblok/svelte'
import { PUBLIC_STORYBLOK_ACCESS_TOKEN_PREVIEW } from '$env/static/public'

// https://www.storyblok.com/tp/add-a-headless-cms-to-svelte-in-5-minutes
export async function load() {
	storyblokInit({
		accessToken: PUBLIC_STORYBLOK_ACCESS_TOKEN_PREVIEW,
		use: [apiPlugin],
		apiOptions: {
			https: true
		}
	})

	const storyblokApi = await useStoryblokApi()

	const { data } = await storyblokApi.get('cdn/stories/home', {
		version: 'draft'
	})

	const showreel = data.story.content.body.find((blok) => blok.component === 'showreel')

	let url = ''
	if (showreel) {
		url = showreel.video_webm.filename
		// url = showreel.video_heavy.filename
		// url = showreel.vimeo_url.url
	}

	return {
		showreelUrl: url
	}
}
