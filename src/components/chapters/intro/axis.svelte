<script>
	import { activeChapter } from '$lib/store'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	import Logo from './logo.svelte'

	let x = null
	let y = null
	let z = null

	let xLine = null
	let yLine = null
	let yLine2 = null
	let zLine = null
	let logo = null

	onMount(() => {
		const timeline = gsap.timeline({
			paused: true,
			onComplete: () => {
				activeChapter.set(1)
			}
		})

		timeline.add(
			gsap.to(x, {
				ease: 'power2.out',
				duration: 0.5,
				opacity: 0
			}),
			0
		)

		timeline.add(
			gsap.to(y, {
				ease: 'power2.out',
				duration: 0.5,
				opacity: 0
			}),
			0.275
		)

		timeline.add(
			gsap.to(zLine, {
				opacity: 1,
				ease: 'expo.out',
				rotate: -45,
				duration: 1
			}),
			1 / 3
		)

		timeline.add(
			gsap.to(z, {
				ease: 'power2.out',
				duration: 0.5,
				opacity: 1
			}),
			0.5
		)

		timeline.add(
			gsap.to([z, zLine], {
				ease: 'power2.out',
				duration: 0.5,
				opacity: 0
			}),
			1
		)

		timeline.add(
			gsap.to(xLine, {
				ease: 'expo.inOut',
				duration: 0.75,
				rotate: 45 + 90
			}),
			1
		)

		timeline.add(
			gsap.set(yLine2, {
				opacity: 1
			}),
			1
		)

		timeline.add(
			gsap.to(yLine2, {
				ease: 'expo.inOut',
				duration: 0.75,
				rotate: 90 + 45 + 90
			}),
			1
		)

		timeline.add(
			gsap.set(logo, {
				opacity: 1,
				x: '-50%',
				y: '-50%'
			}),
			1
		)

		timeline.add(
			gsap.to(logo, {
				ease: 'expo.inOut',
				duration: 0.75,
				rotate: 360,
				scale: 1
			}),
			1
		)

		timeline.progress(0.1)

		timeline.play()

		return () => {
			if (timeline) {
				timeline.kill()
				timeline.clear()
			}
		}
	})
</script>

<div class="absolute inset-0 h-full w-full">
	<div
		bind:this={xLine}
		class="absolute left-1/2 top-1/2 h-[1px] w-[150vw] -translate-x-1/2 -translate-y-1/2 bg-black"
	></div>
	<div
		bind:this={yLine}
		class="absolute left-1/2 top-1/2 h-[1px] w-[150vw] -translate-x-1/2 -translate-y-1/2 rotate-90 bg-black"
	></div>
	<div
		bind:this={yLine2}
		class="absolute left-1/2 top-1/2 h-[1px] w-[150vw] -translate-x-1/2 -translate-y-1/2 rotate-90 bg-black opacity-0"
	></div>
	<div
		bind:this={zLine}
		class="absolute left-1/2 top-1/2 h-[1px] w-[150vw] -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] bg-black opacity-0"
	></div>

	<span bind:this={x} class="opacity-1 font-regular absolute left-0 top-1/2 p-[2vw] text-[4vw]"
		>X</span
	>
	<span bind:this={y} class="opacity-1 font-regular absolute left-1/2 top-0 p-[2vw] text-[4vw]"
		>Y</span
	>
	<span bind:this={z} class="font-regular absolute left-1/2 top-1/2 p-[2vw] text-[4vw] opacity-0"
		>Z</span
	>

	<div
		bind:this={logo}
		class="absolute left-1/2 top-1/2 h-[35vw] w-[35vw] scale-0 rounded-full bg-white p-[5vw]"
	>
		<Logo />
	</div>
</div>
