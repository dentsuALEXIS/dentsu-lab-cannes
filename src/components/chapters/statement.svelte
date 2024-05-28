<script>
	import { activeChapter, windowSize } from '$lib/store'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'
	import { ticker } from '$lib/ticker'
	import { mouse } from '$lib/mouse'

	const nbColumns = 6

	export let image

	let elements = []
	let tick = undefined
	let timeline = null

	let pointer = {
		x: 0,
		y: 0
	}

	function onTick() {
		pointer.x += ($mouse.pointer.x - pointer.x) * 0.1

		const progress = pointer.x / $windowSize.w

		if (timeline) {
			timeline.progress(1 - progress)
		}
	}

	function createTimeline() {
		timeline = gsap.timeline({ paused: true })

		timeline.fromTo(elements[0], { flex: '1' }, { flex: '24', ease: 'none' }, '<')
		timeline.fromTo(elements[1], { flex: '2' }, { flex: '16', ease: 'none' }, '<')
		timeline.fromTo(elements[2], { flex: '4' }, { flex: '8', ease: 'none' }, '<')
		timeline.fromTo(elements[3], { flex: '8' }, { flex: '4', ease: 'none' }, '<')
		timeline.fromTo(elements[4], { flex: '16' }, { flex: '2', ease: 'none' }, '<')
		timeline.fromTo(elements[5], { flex: '24' }, { flex: '1', ease: 'none' }, '<')

		timeline.fromTo(
			elements[0],
			{ yPercent: Math.random() * 20 - 10 },
			{ yPercent: Math.random() * 100 - 50 },
			'<'
		)
		timeline.fromTo(
			elements[1],
			{ yPercent: Math.random() * 40 - 20 },
			{ yPercent: Math.random() * 90 - 45 },
			'<'
		)
		timeline.fromTo(
			elements[2],
			{ yPercent: Math.random() * 60 - 30 },
			{ yPercent: Math.random() * 80 - 40 },
			'<'
		)
		timeline.fromTo(
			elements[3],
			{ yPercent: Math.random() * 80 - 40 },
			{ yPercent: Math.random() * 60 - 30 },
			'<'
		)
		timeline.fromTo(
			elements[4],
			{ yPercent: Math.random() * 90 - 45 },
			{ yPercent: Math.random() * 40 - 20 },
			'<'
		)
		timeline.fromTo(
			elements[5],
			{ yPercent: Math.random() * 100 - 50 },
			{ yPercent: Math.random() * 20 - 10 },
			'<'
		)

		setTimeout(() => {
			activeChapter.set(2)
		}, 3000)

		// timeline.add(() => {
		// }, 4)
	}

	onMount(() => {
		createTimeline()

		tick = ticker.add(onTick)

		return () => {
			if (timeline) {
				timeline.kill()
				timeline.clear()
			}

			if (tick) {
				ticker.remove(tick)
			}
		}
	})
</script>

<section class="fixed inset-0 flex h-full items-center justify-center text-white">
	<div class="flexContainer" style="--nbColumns:{nbColumns};">
		{#each { length: nbColumns } as _, c}
			<div class={`column`} bind:this={elements[c]}>
				{#each { length: nbColumns * 3 } as _}
					<div class={`row`}>
						<img src={image} />
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<span>Statement</span>
</section>

<style lang="scss">
	.flexContainer {
		display: flex;
		height: 30vh;
		width: 80vw;
		align-items: center;
		overflow: hidden;
		z-index: 1000;
	}

	.column {
		display: flex;
		flex-direction: column;
	}
</style>
