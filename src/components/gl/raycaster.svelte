<script>
	import { mouse } from '$lib/mouse'
	import { onDestroy, onMount } from 'svelte'
	import { Raycaster } from 'three'
	import { ticker } from '$lib/ticker'

	export let scene

	let children = []
	let ready = false
	let raycaster = undefined
	let tick = undefined

	function onRaycast() {
		if (ready) {
			// raycaster.setFromCamera($mouse.mouse, $gl.perspectiveCamera)
		}
	}

	function onTick() {
		if (ready) {
			onRaycast()
		}
	}

	async function onInit() {
		raycaster = new Raycaster()
	}

	onMount(async () => {
		await onInit()

		tick = ticker.add(onTick)

		ready = true

		return () => {
			if (tick) {
				ticker.remove(tick)
			}
		}
	})

	onDestroy(() => {
		ready = false

		if (tick) {
			ticker.remove(tick)
		}
	})
</script>
