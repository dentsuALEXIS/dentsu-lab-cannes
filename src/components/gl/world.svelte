<script>
	import { activeChapter, gl, windowSize } from '$lib/store'
	import { fragmentShaderComposition, vertexShaderComposition } from './glsl/composition'
	import {
		Mesh,
		PlaneGeometry,
		Scene,
		ShaderMaterial,
		WebGLRenderTarget,
		Vector2
	} from 'three'
	import { onDestroy, onMount } from 'svelte'
	import { ticker } from '$lib/ticker'
	import { disposeObject } from '$lib/dispose'

	import Raycaster from './raycaster.svelte'
	import Cases from './chapters/cases.svelte'
	import Clients from './chapters/clients.svelte'
	import Reel from './chapters/reel.svelte'
	import Statement from './chapters/statement.svelte'

	import Ripples from './ripples/index.svelte'

	let scene = undefined
	let compositionScene = undefined

	let tick = undefined
	let ready = false
	let ripples = undefined

	let compositionQuad = undefined
	let compositionTarget = undefined

	function onResize() {
		if (compositionTarget) {
			compositionTarget.setSize($windowSize.w * 1.5, $windowSize.h * 1.5)
		}

		if (compositionQuad) {
			compositionQuad.scale.set($windowSize.w, $windowSize.h)

			compositionQuad.material.uniforms.uResolution.value = new Vector2(
				$windowSize.w * 1.5,
				$windowSize.h * 1.5
			)
		}
	}

	function onTick() {
		if (ready) {
			compositionQuad.material.uniforms.uRipples.value = ripples.getTexture()
			compositionQuad.material.uniforms.uTexture.value = compositionTarget.texture

			$gl.renderer.clear()
			$gl.renderer.setRenderTarget(compositionTarget)
			$gl.renderer.render(scene, $gl.orthographicCamera)
			$gl.renderer.clearDepth()
			$gl.renderer.setRenderTarget(null)
			$gl.renderer.render(compositionScene, $gl.orthographicCamera)
		}
	}

	async function onInit() {
		scene = new Scene()
		compositionScene = new Scene()

		compositionTarget = new WebGLRenderTarget($windowSize.w * 2 || 1024, $windowSize.h * 2 || 1024)

		compositionQuad = new Mesh(
			new PlaneGeometry(),
			new ShaderMaterial({
				uniforms: {
					uRipples: { value: null },
					uTexture: { value: null },
					uResolution: {
						value: new Vector2($windowSize.w * 2, $windowSize.h * 2)
					}
				},
				vertexShader: vertexShaderComposition,
				fragmentShader: fragmentShaderComposition
			})
		)

		compositionQuad.position.z = -10

		compositionScene.add(compositionQuad)
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

		if (compositionQuad) {
			disposeObject(compositionQuad, scene)
		}

		if (compositionTarget) {
			compositionTarget.texture.dispose()
		}
	})

	$: {
		if ($windowSize) {
			onResize()
		}
	}

	export let showreelUrl;
</script>

{#if ready}
	<Raycaster {scene} />
	<!-- <Intro {scene} visible={$activeChapter === 0} />å -->
	<Statement {scene} visible={$activeChapter === 1} />
	<Reel {scene} {showreelUrl} visible={$activeChapter === 2} />
	<Cases {scene} visible={$activeChapter === 3} />
	<Clients {scene} visible={$activeChapter === 4} />
	<Ripples bind:this={ripples} {scene} />
{/if}
