<script>
	import { activeChapter, gl } from '$lib/store'
	import { Group, Scene } from 'three'
	import { onDestroy, onMount } from 'svelte'
	import { ticker } from '$lib/ticker'

	import Raycaster from './raycaster.svelte'
	import Cases from './chapters/cases.svelte'
	import Clients from './chapters/clients.svelte'
	import Intro from './chapters/intro.svelte'
	import Reel from './chapters/reel.svelte'
	import Statement from './chapters/statement.svelte'

	import Ripples from './ripples/index.svelte'

	let scene = undefined
	let tick = undefined
	let ready = false

	function onTick() {
		if (ready) {
			$gl.renderer.render(scene, $gl.orthographicCamera)
		}
	}

	async function onInit() {
		scene = new Scene()
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

{#if ready}
	<!-- <Raycaster {scene} />
	<Intro {scene} visible={$activeChapter === 0} />
	<Statement {scene} visible={$activeChapter === 1} />
	<Reel {scene} visible={$activeChapter === 2} />
	<Cases {scene} visible={$activeChapter === 3} />
	<Clients {scene} visible={$activeChapter === 4} /> -->
	<Ripples {scene} />
{/if}
