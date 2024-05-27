<script>
	import '../styles/global.scss'

	import { canHover, webpSupported } from '$lib/store'

	import Device from 'svelte-device-info'
	import GL from '$components/gl/index.svelte'

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
	<GL />
{/await}

<div class="fixed inset-0 flex h-full w-full items-center justify-center text-white">
	<span>Dentsu Lab - Cannes</span>
</div>
