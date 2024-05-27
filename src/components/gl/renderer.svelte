<script>
	import { gl, windowSize } from '$lib/store'
	import { onDestroy, onMount } from 'svelte'
	import { WebGLRenderer } from 'three'

	let canvas = null
	let ready = false
	let renderer = null

	async function onInit() {
		renderer = new WebGLRenderer({
			alpha: false,
			antialias: true,
			canvas
		})

		renderer.setClearColor('#000000')
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		if (gl) {
			gl.update((store) => {
				if (store) {
					store.renderer = renderer

					return store
				}
			})
		}
	}

	async function onResize() {
		if (renderer) {
			renderer.setSize($windowSize.w, $windowSize.h)
		}
	}

	onMount(async () => {
		await onInit()

		ready = true
	})

	onDestroy(() => {
		if (gl) {
			gl.update((store) => {
				if (store) {
					store.renderer = null

					return store
				}
			})
		}

		renderer?.forceContextLoss?.()
		renderer?.dispose?.()
	})

	$: {
		ready && $windowSize && onResize()
	}
</script>

<canvas bind:this={canvas}></canvas>

<style lang="scss">
	canvas {
		height: 100% !important;
		inset: 0;
		width: 100% !important;
		z-index: 1;
	}
</style>
