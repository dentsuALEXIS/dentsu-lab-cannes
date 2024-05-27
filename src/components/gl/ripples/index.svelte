<script>
	import Texture from './texture.svelte'

	import { disposeObject } from '$lib/dispose'
	import { fragmentShader, vertexShader } from './glsl'
	import { Mesh, PlaneGeometry, ShaderMaterial } from 'three'
	import { onMount } from 'svelte'
	import { windowSize } from '$lib/store'

	export let scene

	let ready = false
	let mesh = null

	function onResize() {
		if (mesh) {
			mesh.scale.set($windowSize.w, $windowSize.h, 1)
		}
	}

	onMount(() => {
		const geometry = new PlaneGeometry(1, 1, 1, 1)

		const material = new ShaderMaterial({
			uniforms: {
				uTime: {
					value: 0
				},
				uTexture: {
					value: null
				}
			},
			vertexShader,
			fragmentShader
		})

		mesh = new Mesh(geometry, material)

		mesh.position.z = -10

		scene.add(mesh)

		ready = true

		return () => {
			ready = false

			mesh = disposeObject(mesh, scene)
		}
	})

	$: {
		ready && $windowSize && onResize()
	}
</script>

{#if mesh}
	<Texture {mesh} />
{/if}
