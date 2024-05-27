<script>
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	import Kinetic from './kinetic.svelte'

	const length = 6 * 6
	const blocks = new Array(length).fill('placeholder')

	let currentStep = 0
	let element = null

	onMount(() => {
		gsap.set(element, {
			scale: 0.875,
			delay: 1 / 3
		})
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
</section>

<style lang="scss">
</style>
