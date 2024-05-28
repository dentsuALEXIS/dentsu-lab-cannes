<script>
	import '../styles/global.scss'

	import { canHover, webpSupported } from '$lib/store'

	import Device from 'svelte-device-info'

	import GL from '$components/gl/index.svelte'
	import Chapters from '$components/chapters/index.svelte'
	import Navigation from '$components/navigation.svelte'

	import { onMount } from 'svelte'

	export let data

	const promise = onInitCheck()

	async function onInitCheck() {
		if (!window.createImageBitmap) {
			return
		}

		const data =
			'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA='
		const blob = await fetch(data).then((r) => r.blob())
		const webpCheck = await createImageBitmap(blob).then(
			() => true,
			() => false
		)

		canHover.set(Device.PointingAccuracy === 'fine')

		webpSupported.set(webpCheck)
	}

	onMount(() => {})
</script>

{#await promise then}
	<GL showreelUrl={data.showreelUrl} />
	<Chapters image={data.image} />
	<Navigation />
{/await}

<slot />
