<script>
	import { Group, Scene } from 'three'
	import { gl } from '$lib/store'
	import { onDestroy, onMount } from 'svelte'
	import { ticker } from '$lib/ticker'

	import Raycaster from './raycaster.svelte'

	let scene = undefined
	let group = undefined
	let tick = undefined
	let ready = false

	function onTick() {
		if (ready) {
			$gl.renderer.render(scene, $gl.perspectiveCamera)
		}
	}

	async function onInit() {
		scene = new Scene()
		group = new Group()

		scene.add(group)
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

<Raycaster {scene} />
