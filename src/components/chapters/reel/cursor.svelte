<script>
	import { gsap } from 'gsap'
	import { reelElement, windowSize } from '$lib/store'
	import { mouse } from '$lib/mouse'
	import { onMount } from 'svelte'
	import { ticker } from '$lib/ticker'

	export let activeControls
	export let activeHover

	let active = false
	let element = null
	let tick = undefined

	let firstElement = null
	let lastElement = null

	let moving = false
	let timeout = null

	let pointer = {
		x: 0,
		y: 0
	}

	function onMovingChange(state) {
		if (element) {
			gsap.to(element, {
				opacity: state ? 1 : 0,
				ease: 'power2.out',
				duration: 0.5
			})
		}
	}

	function onActiveChange(state) {
		if (firstElement) {
			gsap.to(firstElement, {
				y: state ? '-100%' : '0%',
				ease: 'expo.out',
				duration: 0.75
			})
		}

		if (lastElement) {
			gsap.to(lastElement, {
				y: state ? '0%' : '100%',
				ease: 'expo.out',
				duration: 0.75
			})
		}
	}

	function onTick() {
		pointer.x += ($mouse.mouse.x - pointer.x) * 0.1
		pointer.y += ($mouse.mouse.y - pointer.y) * 0.1

		if (element) {
			element.style.transform = `translate3d(calc(-50% + ${(pointer.x * $windowSize.w) / 2}px), calc(-50% + ${(-pointer.y * $windowSize.h) / 2}px), 0)`
		}

		if ($reelElement?.paused) {
			active = false
		} else if (activeControls && !$reelElement?.paused) {
			active = true
		}
	}

	onMount(() => {
		function onMouseMove() {
			clearTimeout(timeout)

			moving = true

			timeout = setTimeout(() => {
				moving = false
			}, 1000)
		}

		window.addEventListener('mousemove', onMouseMove)

		tick = ticker.add(onTick)

		return () => {
			window.removeEventListener('mousemove', onMouseMove)

			if (tick) {
				ticker.remove(tick)
			}
		}
	})

	$: {
		onActiveChange(active)
	}

	$: {
		onMovingChange(moving && !activeHover)
	}
</script>

<span
	bind:this={element}
	class="pointer-events-none absolute left-1/2 top-1/2 flex h-[6rem] w-[6rem] items-center justify-center border-[2px] border-solid border-white text-white opacity-0"
>
	<span
		class="relative flex w-full flex-col items-center overflow-hidden text-[1.125rem] font-bold"
	>
		<span bind:this={firstElement} class="leading-[1]">Play</span>
		<span
			bind:this={lastElement}
			class="absolute left-0 top-0 w-full translate-y-[100%] text-center leading-[1]">Pause</span
		>
	</span>
</span>
