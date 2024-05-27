<script>
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'
	import { windowSize } from '$lib/store'
	import Line from './line.svelte'

	const locations = ['London', 'Amsterdam', 'Milan', 'Paris', 'Warsaw', 'Madrid', 'Hamburg']

	export let i
	export let length

	let element = null

	function onResize() {
		const root = Math.ceil(Math.sqrt(length))

		let x = i % root
		let y = Math.floor(i / root)

		x -= (root - 1) / 2
		y -= (root - 1) / 2

		element.style.transform = `translate(calc(-50% + ${x * 100}%), calc(-50% + ${y * 100}%))`
	}

	$: {
		if (element) {
			onResize($windowSize)
		}
	}
</script>

<ul
	bind:this={element}
	class="absolute left-1/2 top-1/2 flex h-[12.5vw] w-[20vw] flex-shrink-0 flex-col justify-center"
>
	{#each locations as location}
		<li class="flex text-[1.25vw] font-bold leading-[0.9]">
			<Line {location} />
		</li>
	{/each}
</ul>
