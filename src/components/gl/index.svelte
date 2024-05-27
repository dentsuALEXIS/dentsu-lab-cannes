<script>
	import { onMount } from 'svelte'
	import { gl, windowSize } from '$lib/store'

	import Renderer from './renderer.svelte'
	import Camera from './camera.svelte'
	import World from './world.svelte'

	let element = null

	function bindObserver() {
		let resizeObserver = undefined

		resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const w = entry.contentBoxSize
					? entry.contentBoxSize[0].inlineSize
					: entry.contentRect.width
				const h = entry.contentBoxSize
					? entry.contentBoxSize[0].blockSize
					: entry.contentRect.height

				windowSize.set({
					w,
					h
				})
			}
		})

		if (element) {
			resizeObserver.observe(element)
		}
	}

	onMount(async () => {
		bindObserver()
	})
</script>

<div bind:this={element}>
	<Renderer />
</div>

<Camera />

{#if $gl.renderer && $gl.orthographicCamera}
	<World />
{/if}

<style lang="scss">
	div {
		position: fixed;
		height: 100vh;
		height: 100svh;
		width: 100%;
		inset: 0;
		z-index: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
