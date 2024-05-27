<script>
	import { disposeObject } from '$lib/dispose'
	import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
	import { onDestroy, onMount } from 'svelte'
	import { ticker } from '$lib/ticker'
	import { windowSize } from '$lib/store'

	export let scene
	export let visible

	let group = null
	let mesh = null
	let ready = false
	let tick = undefined

	function createMesh() {
		const geometry = new PlaneGeometry(1, 1, 1, 1)
		const material = new MeshBasicMaterial({ color: 'green' })

		mesh = new Mesh(geometry, material)

		group.add(mesh)
	}

	function onResize() {
		if (mesh) {
			mesh.scale.set($windowSize.w, $windowSize.h)
		}
	}

	function onTick() {
		if (ready && visible) {
			console.log('tick cases')
		}
	}

	async function onInit() {
		group = new Group()

		group.position.z = -10

		group.scale.setScalar(0.5)

		createMesh()

		scene.add(group)
	}

	onMount(async () => {
		await onInit()

		tick = ticker.add(onTick)

		ready = true
	})

	onDestroy(() => {
		ready = false

		if (mesh) {
			disposeObject(mesh, scene)
		}

		if (group) {
			disposeObject(group, scene)
		}

		if (tick) {
			ticker.remove(tick)
		}
	})

	$: {
		if (group) {
			group.visible = visible
		}
	}

	$: {
		onResize($windowSize)
	}
</script>
