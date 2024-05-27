<script>
	import { gl, windowSize } from '$lib/store'
	import { OrthographicCamera, PerspectiveCamera } from 'three'
	import { onDestroy, onMount } from 'svelte'

	let orthographicCamera = null
	let perspectiveCamera = null
	let ready = false

	async function onInit() {
		orthographicCamera = new OrthographicCamera(
			$windowSize.w / -2,
			$windowSize.w / 2,
			$windowSize.h / 2,
			$windowSize.h / -2,
			0.1,
			1000
		)

		orthographicCamera.position.set(0, 0, 0)

		perspectiveCamera = new PerspectiveCamera(45, $windowSize.w / $windowSize.h, 0.1, 1000)

		perspectiveCamera.lookAt(0, 0, 0)
	}

	function updateCamera(orthographicCamera, perspectiveCamera) {
		if (gl) {
			gl.update((store) => {
				if (store) {
					store.orthographicCamera = orthographicCamera
					store.perspectiveCamera = perspectiveCamera

					return store
				}
			})
		}
	}

	function onResize() {
		if (orthographicCamera) {
			orthographicCamera.left = -$windowSize.w / 2
			orthographicCamera.right = $windowSize.w / 2
			orthographicCamera.top = $windowSize.h / 2
			orthographicCamera.bottom = -$windowSize.h / 2
			orthographicCamera.updateProjectionMatrix()
		}

		if (perspectiveCamera) {
			perspectiveCamera.aspect = $windowSize.w / $windowSize.h
			perspectiveCamera.updateProjectionMatrix()
		}
	}

	onMount(async () => {
		await onInit()

		updateCamera(orthographicCamera, perspectiveCamera)

		ready = true
	})

	onDestroy(() => {
		updateCamera(null, null)
	})

	$: {
		ready && $windowSize && onResize()
	}
</script>
