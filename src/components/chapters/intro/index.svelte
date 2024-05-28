<script>
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	import Kinetic from './kinetic.svelte'
	import Axis from './axis.svelte'

	const length = 6 * 6
	const blocks = new Array(length).fill('placeholder')

	let currentStep = 0
	let element = null

	onMount(() => {
		const timeline = gsap.timeline({ paused: true })

		if (element) {
			timeline.add(
				gsap.set(element, {
					scale: 0.875,
					delay: 0.35
				}),
				0
			)
		}

		timeline.add(() => {
			currentStep = 1
		}, 0.7)

		timeline.play()

		return () => {
			if (timeline) {
				timeline.kill()
				timeline.clear()
			}
		}
	})
</script>

<section class="fixed inset-0 flex h-full items-center justify-center overflow-hidden">
	{#if currentStep === 0}
		<div class="absolute inset-0 h-full w-full scale-[1.75]" bind:this={element}>
			{#each blocks as block, i}
				{#key i}
					<Kinetic {length} {i} />
				{/key}
			{/each}
		</div>
	{/if}

	{#if currentStep === 1}
		<Axis />
	{/if}
</section>

<style lang="scss">
</style>
