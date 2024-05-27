<script>
	import { mouse } from '$lib/mouse'
	import { onMount } from 'svelte'
	import { Texture } from 'three'
	import { ticker } from '$lib/ticker'
	import { windowSize } from '$lib/store'

	const SIZE = 8

	const props = {
		size: SIZE,
		radius: SIZE,
		width: SIZE,
		height: SIZE,
		maxAge: SIZE * 6
	}

	export let mesh

	let canvas = undefined
	let ctx = undefined
	let last = undefined
	let ready = false
	let texture = undefined
	let tick = undefined

	let canvasSize = {
		width: 0,
		height: 0
	}

	let points = []

	function easeOutSine(t, b, c, d) {
		return c * Math.sin((t / d) * (Math.PI / 2)) + b
	}

	function easeOutQuad(t, b, c, d) {
		t /= d

		return -c * t * (t - 2) + b
	}

	function onResize() {
		canvasSize = {
			width: $windowSize.w / 16,
			height: $windowSize.h / 16
		}

		if (canvas) {
			canvas.width = canvasSize.width
			canvas.height = canvasSize.height
		}
	}

	function onClear() {
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, canvas.width, canvas.height)
	}

	function addPoint() {
		const point = {
			x: $mouse.pointer.x / $windowSize.w,
			y: $mouse.pointer.y / $windowSize.h
		}

		let force = 0
		let vx = 0
		let vy = 0

		const previous = last

		if (previous) {
			const relativeX = point.x - previous.x
			const relativeY = point.y - previous.y

			const distanceSquared = relativeX * relativeX + relativeY * relativeY
			const distance = Math.sqrt(distanceSquared)

			vx = relativeX / distance
			vy = relativeY / distance

			force = Math.min(distanceSquared * 10000, 1)
		}

		last = {
			x: point.x,
			y: point.y
		}

		points.push({
			x: point.x,
			y: point.y,
			age: 0,
			force,
			vx,
			vy
		})
	}

	function onTick() {
		onClear()

		let agePart = 1 / props.maxAge

		points.forEach((point, i) => {
			let slowAsOlder = 1 - point.age / props.maxAge
			let force = point.force * agePart * slowAsOlder

			point.x += point.vx * force
			point.y += point.vy * force
			point.age += 1

			if (point.age > props.maxAge) {
				points.splice(i, 1)
			}
		})

		points.forEach((point) => {
			drawPoint(point)
		})

		if (mesh) {
			mesh.material.uniforms.uTexture.value = texture
		}

		texture.needsUpdate = true
	}

	function drawPoint(point) {
		let pos = {
			x: point.x * canvasSize.width,
			y: point.y * canvasSize.height
		}

		const context = ctx
		const radius = props.radius

		let intensity = 0.5

		if (point.age < props.maxAge * 0.25) {
			intensity = easeOutSine(point.age / (props.maxAge * 0.25), 0, 1, 1)
		} else {
			intensity = easeOutQuad(
				1 - (point.age - props.maxAge * 0.25) / (props.maxAge * 0.75),
				0,
				1,
				1
			)
		}

		intensity *= point.force

		let color = '255, 255, 255'
		let offset = canvasSize.width * 5

		context.shadowOffsetX = offset
		context.shadowOffsetY = offset
		context.shadowBlur = radius * 1
		context.shadowColor = `rgba(${color}, ${0.2 * intensity})`

		context.beginPath()
		context.fillStyle = 'rgba(255, 0, 0, 1)'

		context.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2)
		context.fill()
	}

	onMount(() => {
		canvasSize = {
			width: $windowSize.w / 16,
			height: $windowSize.h / 16
		}

		canvas = document.createElement('canvas')

		canvas.width = canvasSize.width
		canvas.height = canvasSize.height

		ctx = canvas.getContext('2d')

		texture = new Texture(canvas)

		onClear()

		tick = ticker.add(onTick)

		ready = true

		return () => {
			ready = false

			texture?.dispose?.()
			canvas?.remove?.()

			if (tick) {
				ticker.remove(onTick)
			}
		}
	})

	$: {
		ready && $windowSize && onResize()
	}

	$: {
		ready && $mouse && addPoint()
	}
</script>
