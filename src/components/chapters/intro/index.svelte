<script>
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	import Kinetic from './kinetic.svelte'

	const length = 6 * 6
	const blocks = new Array(length).fill('placeholder')

	let currentStep = 1

	let element = null
	let timeline = null

	onMount(() => {
		timeline = gsap.timeline({ paused: true })

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
		}, 0.75)

		timeline.play()
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
		Step 1
	{/if}
</section>

<style lang="scss">
</style>
