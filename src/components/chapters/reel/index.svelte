<script>
	import Controls from './controls.svelte'
	import Cursor from './cursor.svelte'

	import { activeChapter, reelElement } from '$lib/store'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'
	import { ticker } from '$lib/ticker'

	let projects = [
		{
			label: 'Unlabeled',
			duration: 2,
			sum: 2
		},
		{
			label: 'All Players Welcome',
			duration: 4,
			sum: 4
		},
		{
			label: 'Wind Of Change',
			duration: 6,
			sum: 6
		}
	]

	let activeControls = false
	let activeIndex = 0
	let currentTime = 0

	let tick = undefined
	let timeline = undefined

	let list = []
	let reversedList = []
	let transformElements = []

	function onActiveProjectChange(activeIndex) {
		gsap.killTweensOf(list)
		gsap.killTweensOf(reversedList)

		list.forEach((element, index) => {
			const realIndex = index - activeIndex

			gsap.to(element, {
				y: `${realIndex * 100}%`,
				ease: 'expo.out',
				duration: 1
			})
		})

		reversedList.forEach((element, index) => {
			const realIndex = index - activeIndex

			gsap.to(element, {
				y: `${realIndex * 100}%`,
				ease: 'expo.out',
				duration: 1
			})
		})
	}

	function formatTime(currentTime) {
		let time = `${currentTime.toFixed(2)}`

		time = time.split('.')

		return `00:0${time[0]}:${time[1]}`
	}

	function createTimeline(timeline) {
		const firstRow = [...transformElements].slice(0, 8)
		const lastRow = [...transformElements].slice(8, 16)

		const rows = [firstRow, lastRow]

		rows.forEach((row) => {
			row.forEach((element, index) => {
				const delay = index % 2 === 0 ? 0 : 0.075

				timeline.add(
					gsap.fromTo(
						element,
						{
							y: '100%'
						},
						{
							y: '0%',
							ease: 'expo.out',
							duration: 0.75,
							delay
						}
					),
					index * 0.05
				)
			})
		})

		// timeline.add(
		// 	() => {
		// 		activeChapter.set(3)
		// 	},
		// 	projects[projects.length - 1].sum
		// )
	}

	async function animateOut() {
		timeline.pause()

		const firstRow = [...transformElements].slice(0, 8)
		const lastRow = [...transformElements].slice(8, 16)

		const rows = [firstRow, lastRow]

		let tween

		rows.forEach((row) => {
			row.forEach((element, index) => {
				gsap.killTweensOf(element)

				tween = gsap.to(element, {
					y: '100%',
					ease: 'expo.out',
					duration: 0.65,
					delay: index * 0.05
				})
			})
		})

		return tween
	}

	function onTick() {
		if (!activeControls) {
			currentTime = $reelElement?.currentTime || 0

			const activeProject = [...projects].filter((project) => project.sum >= currentTime)[0]

			activeIndex = projects.indexOf(activeProject)
		}
	}

	onMount(() => {
		timeline = gsap.timeline({ paused: true })

		tick = ticker.add(onTick)

		createTimeline(timeline)

		timeline.play()

		return () => {
			if (tick) {
				ticker.remove(tick)
			}

			if (timeline) {
				timeline.kill()
				timeline.clear()
			}
		}
	})

	$: {
		onActiveProjectChange(activeIndex)
	}
</script>

<section
	class="fixed inset-0 flex h-full w-full flex-col items-center justify-between py-[10vh] text-[3.125vw] font-bold tracking-[-0.03em] text-white"
>
	<div class="relative flex w-full justify-center gap-x-[7.5vw]">
		<div class="absolute right-full flex -translate-x-[-5vw] flex-col items-end whitespace-nowrap">
			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[0]}>Timer</span>
			</div>

			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[1]}
					>{formatTime(currentTime)}</span
				>
			</div>
		</div>

		<div class="flex flex-col items-end whitespace-nowrap">
			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[2]}>Project name:</span>
			</div>

			<div class="overflow-y-clip leading-[0.9]">
				<ul
					class="relative flex translate-y-[100%] flex-col items-end overflow-y-clip"
					bind:this={transformElements[3]}
				>
					{#each projects as project, i}
						<li
							bind:this={reversedList[i]}
							class={`right-0 top-0 flex ${i === 0 ? '' : 'absolute'}`}
							style={`transform: translate(0%, ${i * 100}%)`}
						>
							<span>{project.label}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="flex flex-col whitespace-nowrap">
			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[4]}>Project name:</span>
			</div>

			<div class="overflow-y-clip leading-[0.9]">
				<ul
					class="relative flex flex-col items-start overflow-y-clip"
					bind:this={transformElements[5]}
				>
					{#each projects as project, i}
						<li
							bind:this={list[i]}
							class={`left-0 top-0 flex ${i === 0 ? '' : 'absolute'}`}
							style={`transform: translate(0%, ${i * 100}%)`}
						>
							<span>{project.label}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="absolute left-full flex -translate-x-[5vw] flex-col whitespace-nowrap">
			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[6]}>Timer</span>
			</div>

			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[7]}
					>{formatTime(currentTime)}</span
				>
			</div>
		</div>
	</div>

	<div class="relative flex w-full justify-around">
		<div class="flex flex-col items-end whitespace-nowrap">
			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[14]}>Dentsu Lab</span>
			</div>

			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[15]}>Tokyo 2024</span>
			</div>
		</div>

		<div class="flex flex-col items-end whitespace-nowrap">
			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[12]}>Play</span>
			</div>

			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[13]}>Showreel</span>
			</div>
		</div>

		<div class="flex flex-col whitespace-nowrap">
			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[10]}>Play</span>
			</div>

			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[11]}>Showreel</span>
			</div>
		</div>

		<div class="flex flex-col whitespace-nowrap">
			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[8]}>Dentsu Lab</span>
			</div>

			<div class="flex overflow-y-clip leading-[0.9]">
				<span class="translate-y-[100%]" bind:this={transformElements[9]}>Tokyo 2024</span>
			</div>
		</div>
	</div>

	<button
		class="absolute inset-0 h-full w-full"
		type="button"
		aria-label="Open fullscreen showreel"
		on:click={async () => {
			await animateOut()

			activeControls = true
		}}
	>
	</button>
</section>

{#if activeControls && $reelElement}
	<Controls />
{/if}

<Cursor {activeControls} />
