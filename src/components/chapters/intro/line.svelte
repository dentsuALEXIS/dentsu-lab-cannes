<script>
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	export let location

	let letters = []

	onMount(() => {
		const timeline = gsap.timeline({ paused: true })

		letters.forEach((letter, index) => {
			timeline.add(
				gsap.to(letter, {
					marginLeft: `0.75vw`,
					duration: 0.15,
					delay: index * 0.0875,
					ease: 'expo.inOut'
				}),
				0
			)
		})

		timeline.progress(0)

		timeline.play()

		return () => {
			if (timeline) {
				timeline.kill()
				timeline.clear()
			}
		}
	})
</script>

{#each location.split('') as letter, i}
	<span bind:this={letters[i]}>{letter}</span>
{/each}
