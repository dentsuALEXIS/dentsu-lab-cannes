<script>
	import Hls from 'hls.js'

	import { gsap } from 'gsap'
	import { disposeObject } from '$lib/dispose'
	import { fragmentShader, vertexShader } from './glsl/reel'
	import { Group, Mesh, PlaneGeometry, ShaderMaterial, VideoTexture, Vector2 } from 'three'
	import { onDestroy, onMount } from 'svelte'
	import { ticker } from '$lib/ticker'
	import { reelElement, windowSize } from '$lib/store'

	export let scene
	export let visible

	export let showreelUrl

	let url =
		showreelUrl ||
		'https://player.vimeo.com/external/913085807.m3u8?s=dd78225e2fb87ffc8c9bdf148a1fc86df73c5993&logging=false'

	let group = null
	let mesh = null
	let ready = false
	let tick = undefined
	let texture = undefined
	let video = undefined
	let loaded = false
	let hls = null

	function createVideo() {
		video = document.createElement('video')

		video.playsInline = true
		video.muted = true
		video.loop = true
		video.crossOrigin = 'anonymous'

		if (Hls.isSupported()) {
			hls = new Hls({
				startLevel: 4
			})

			hls.loadSource(url)
			hls.attachMedia(video)

			hls.on(Hls.Events.MANIFEST_LOADED, () => {
				loaded = true
			})

			hls.on(Hls.Events.ERROR, () => {
				video.src = url

				video.addEventListener('loadedmetadata', () => {
					loaded = true
				})
			})
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = url

			video.addEventListener('loadedmetadata', () => {
				loaded = true
			})
		}

		texture = new VideoTexture(video)
	}

	function onVisibleCheck() {
		if (video) {
			if (visible) {
				animateIn()

				video.play()
			} else {
				if (mesh) {
					mesh.material.uniforms.uOpacity.value = 0
				}

				video.currentTime = 0
				video.pause()
			}
		}
	}

	function createMesh() {
		const geometry = new PlaneGeometry(1, 1, 1, 1)
		const material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTexture: {
					value: texture
				},
				uImageSize: {
					value: new Vector2(3456, 2156)
				},
				uMeshSize: {
					value: new Vector2($windowSize.w, $windowSize.h)
				},
				uOpacity: {
					value: 0
				},
				transparent: true
			}
		})

		mesh = new Mesh(geometry, material)

		group.add(mesh)
	}

	function animateIn() {
		gsap.killTweensOf(mesh.material.uniforms.uOpacity)

		gsap.fromTo(
			mesh.material.uniforms.uOpacity,
			{
				value: 0
			},
			{
				value: 1,
				ease: 'power2.out',
				duration: 1
			}
		)
	}

	function onResize() {
		if (mesh) {
			mesh.scale.set($windowSize.w, $windowSize.h)
			mesh.material.uniforms.uMeshSize.value = new Vector2($windowSize.w, $windowSize.h)
		}
	}

	function onTick() {
		if (ready && visible) {
			console.log('tick reel')
		}
	}

	async function onInit() {
		group = new Group()

		group.position.z = -10

		group.scale.setScalar(1)

		createVideo()
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

		if (hls) {
			hls.destroy()
		}

		if (mesh) {
			disposeObject(mesh, scene)
		}

		if (group) {
			disposeObject(group, scene)
		}

		if (tick) {
			ticker.remove(tick)
		}

		if (video) {
			video.remove()

			reelElement.set(undefined)
		}
	})

	$: {
		if (group && loaded) {
			reelElement.set(video)

			group.visible = visible

			onVisibleCheck()
		}
	}

	$: {
		onResize($windowSize)
	}
</script>
