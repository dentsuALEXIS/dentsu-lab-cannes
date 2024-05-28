<script>
	import { activeChapter, reelElement } from '$lib/store'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'
	import { ticker } from '$lib/ticker'

	export let setActiveHover

	let element = null
	let input = null
	let scale = null
	let layer = null
	let pressed = false
	let tick = undefined

	function animateIn() {
		gsap.to(element, {
			opacity: 1,
			ease: 'power2.out',
			duration: 0.75
		})
	}

	async function animateOut() {
		return gsap.to(layer, {
			opacity: 1,
			ease: 'power2.out',
			duration: 0.5
		})
	}

	function onTick() {
		if ($reelElement && !pressed) {
			const currentTime = $reelElement.currentTime

			if (input && !pressed) {
				input.value = currentTime / $reelElement.duration
			}

			if (scale) {
				scale.style.transform = `scaleX(${currentTime / $reelElement.duration})`
			}
		}
	}

	onMount(() => {
		animateIn()

		tick = ticker.add(onTick)

		return () => {
			if (tick) {
				ticker.remove(tick)
			}
		}
	})
</script>

<div class="fixed inset-0 h-full w-full text-white opacity-0" bind:this={element}>
	<button
		aria-label="Toggle playstate"
		type="button"
		class="absolute inset-0 h-full w-full"
		on:click={(e) => {
			e.stopPropagation()

			if ($reelElement.paused) {
				$reelElement.play()
			} else {
				$reelElement.pause()
			}
		}}
	>
	</button>

	<button
		class="absolute right-[5rem] top-[3.875rem] text-[1.125rem] font-bold"
		type="button"
		on:mousemove={() => {
			setActiveHover(true)
		}}
		on:mouseleave={() => {
			setActiveHover(false)
		}}
		on:click={async () => {
			// await animateOut()

			activeChapter.set(3)
		}}
	>
		Close
	</button>

	<div
		class="absolute bottom-0 left-0 right-0 px-[12.5rem] py-[3.75rem] pl-[10rem]"
		on:mousemove={() => {
			setActiveHover(true)
		}}
		on:mouseleave={() => {
			setActiveHover(false)
		}}
	>
		<div class="relative mx-1 flex h-[1px] w-full bg-white bg-opacity-[35%]">
			<div
				bind:this={scale}
				class="absolute inset-0 h-full w-full origin-left scale-[0.5] bg-white"
			></div>

			<input
				type="range"
				min={0}
				max={1}
				step={0.01}
				value={0}
				class="absolute left-0 top-[-20px] h-[40px] w-full cursor-pointer opacity-0"
				bind:this={input}
				on:mousedown={() => {
					pressed = true
				}}
				on:mouseup={() => {
					pressed = false
				}}
				on:change={(e) => {
					const progress = parseFloat(e.target.value)

					if ($reelElement) {
						$reelElement.currentTime = progress * $reelElement.duration
					}
				}}
			/>
		</div>

		<button
			class="absolute right-[5rem] top-1/2 -translate-y-1/2 text-[1.125rem] font-bold"
			type="button"
			on:click={() => {
				$reelElement.muted = !$reelElement.muted
			}}
		>
			{$reelElement.muted ? 'Unmute' : 'Mute'}
		</button>
	</div>

	<div
		bind:this={layer}
		class="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0"
	></div>
</div>
